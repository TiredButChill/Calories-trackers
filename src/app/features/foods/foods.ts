import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { startWith, switchMap, take } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { FoodService } from '../../core/services/food.service';

@Component({
  selector: 'app-foods',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, DialogModule, InputTextModule, InputNumberModule, IconFieldModule, InputIconModule],
  templateUrl: './foods.html'
})
export class Foods {
  private readonly fb = inject(FormBuilder);
  private readonly foodService = inject(FoodService);
  private readonly authService = inject(AuthService);

  readonly showDialog = signal(false);

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
}
