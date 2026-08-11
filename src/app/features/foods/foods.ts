import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import JSON5 from 'json5';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { startWith, switchMap, take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { FoodService } from '../../core/services/food.service';
import { Food } from '../../core/models';

const BULK_IMPORT_EXAMPLE = `[
  { "name": "Cơm trắng", "servingSize": 100, "calories": 130, "protein": 2.7, "fat": 0.3, "carb": 28 },
  { "name": "Ức gà luộc", "servingSize": 100, "calories": 165, "protein": 31, "fat": 3.6, "carb": 0 }
]`;

// Accepts strict JSON as well as the looser JS-object-literal shape people naturally paste
// from editors/ChatGPT (unquoted keys, single quotes, trailing commas, a `const x = ...;` wrapper).
function parseBulkInput(raw: string): unknown {
  const text = raw
    .trim()
    .replace(/^(export\s+)?(const|let|var)\s+\w+\s*(:\s*[^=]+)?=\s*/i, '')
    .replace(/;\s*$/, '');
  return JSON5.parse(text);
}

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, DialogModule, InputTextModule, InputNumberModule, IconFieldModule, InputIconModule, TextareaModule],
  templateUrl: './foods.html'
})
export class Foods {
  private readonly fb = inject(FormBuilder);
  private readonly foodService = inject(FoodService);
  private readonly authService = inject(AuthService);

  readonly showDialog = signal(false);
  readonly showBulkDialog = signal(false);
  readonly bulkError = signal('');
  readonly bulkSuccess = signal('');
  readonly bulkImporting = signal(false);
  readonly bulkImportExample = BULK_IMPORT_EXAMPLE;

  bulkText = this.fb.control('', Validators.required);

  search = this.fb.control('');
  foods$ = this.search.valueChanges.pipe(
    startWith(''),
    switchMap((term) => this.foodService.searchFoods(term ?? ''))
  );

  foodForm = this.fb.group({
    name: ['', Validators.required],
    servingSize: [100, Validators.required],
    calories: [0, Validators.required],
    protein: [0, Validators.required],
    fat: [0, Validators.required],
    carb: [0, Validators.required]
  });

  submit(): void {
    if (this.foodForm.invalid) {
      return;
    }
    const value = this.foodForm.getRawValue();
    this.authService.currentUser$.pipe(take(1)).subscribe(async (currentUser) => {
      await this.foodService.addFood({
        name: value.name!,
        servingSize: Number(value.servingSize),
        calories: Number(value.calories),
        protein: Number(value.protein),
        fat: Number(value.fat),
        carb: Number(value.carb),
        createdBy: currentUser?.uid ?? ''
      });
      this.foodForm.reset({ servingSize: 100, calories: 0, protein: 0, fat: 0, carb: 0, name: '' });
      this.showDialog.set(false);
    });
  }

  async remove(id: string): Promise<void> {
    await this.foodService.deleteFood(id);
  }

  openBulkDialog(): void {
    this.bulkText.reset('');
    this.bulkError.set('');
    this.bulkSuccess.set('');
    this.showBulkDialog.set(true);
  }

  async submitBulk(): Promise<void> {
    this.bulkError.set('');
    this.bulkSuccess.set('');

    let parsed: unknown;
    try {
      parsed = parseBulkInput(this.bulkText.value ?? '');
    } catch {
      this.bulkError.set('Không đọc được dữ liệu. Kiểm tra lại định dạng (mảng object, VD: [ { "name": ... }, ... ]).');
      return;
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
      this.bulkError.set('Cần một mảng chứa ít nhất một món ăn.');
      return;
    }

    const currentUser = await new Promise<{ uid: string } | null>((resolve) => {
      this.authService.currentUser$.pipe(take(1)).subscribe(resolve);
    });

    const foods: Food[] = [];
    for (const [index, entry] of parsed.entries()) {
      if (typeof entry !== 'object' || entry === null || typeof (entry as Record<string, unknown>)['name'] !== 'string' || typeof (entry as Record<string, unknown>)['calories'] !== 'number') {
        this.bulkError.set(`Món thứ ${index + 1} thiếu "name" (chuỗi) hoặc "calories" (số).`);
        return;
      }
      const item = entry as Record<string, unknown>;
      foods.push({
        name: item['name'] as string,
        servingSize: Number(item['servingSize'] ?? 100),
        calories: Number(item['calories']),
        protein: Number(item['protein'] ?? 0),
        fat: Number(item['fat'] ?? 0),
        carb: Number(item['carb'] ?? 0),
        ...(item['fiber'] !== undefined ? { fiber: Number(item['fiber']) } : {}),
        ...(item['sugar'] !== undefined ? { sugar: Number(item['sugar']) } : {}),
        ...(item['sodium'] !== undefined ? { sodium: Number(item['sodium']) } : {}),
        createdBy: currentUser?.uid ?? ''
      });
    }

    this.bulkImporting.set(true);
    try {
      const count = await this.foodService.bulkAddFoods(foods);
      this.bulkSuccess.set(`Đã thêm ${count} món ăn.`);
      this.bulkText.reset('');
    } catch {
      this.bulkError.set('Có lỗi khi lưu dữ liệu. Vui lòng thử lại.');
    } finally {
      this.bulkImporting.set(false);
    }
  }
}
