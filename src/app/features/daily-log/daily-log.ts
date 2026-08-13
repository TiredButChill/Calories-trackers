import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { DailyLogService } from '../../core/services/daily-log.service';
import { FoodService } from '../../core/services/food.service';
import { TranslationService } from '../../core/services/translation.service';
import { DailyLogItem, Food, MealType } from '../../core/models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-daily-log',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, DialogModule, InputNumberModule, SelectModule, TranslatePipe],
  templateUrl: './daily-log.html'
})
export class DailyLog {
  private readonly fb = inject(FormBuilder);
  private readonly dailyLogService = inject(DailyLogService);
  private readonly foodService = inject(FoodService);
  private readonly translationService = inject(TranslationService);

  foods$ = this.foodService.getFoods();
  log$ = this.dailyLogService.getToday();
  readonly showDialog = signal(false);

  private foods: Food[] = [];

  logForm = this.fb.group({
    foodId: ['', Validators.required],
    grams: [100, Validators.required],
    meal: ['breakfast' as MealType, Validators.required]
  });

  constructor() {
    this.foods$.subscribe((foods) => (this.foods = foods));
  }

  getMealTypes(): { label: string; value: MealType }[] {
    return [
      { label: this.translationService.t('daily-log.mealBreakfast'), value: 'breakfast' },
      { label: this.translationService.t('daily-log.mealLunch'), value: 'lunch' },
      { label: this.translationService.t('daily-log.mealDinner'), value: 'dinner' },
      { label: this.translationService.t('daily-log.mealSnack'), value: 'snack' }
    ];
  }

  mealGroups(items: DailyLogItem[] | undefined): { meal: MealType; label: string; items: DailyLogItem[] }[] {
    return this.getMealTypes().map(({ value, label }) => ({
      meal: value,
      label,
      items: (items ?? []).filter((item) => item.meal === value)
    }));
  }

  openDialog(): void {
    this.logForm.reset({ foodId: '', grams: 100, meal: 'breakfast' });
    this.showDialog.set(true);
  }

  async submit(): Promise<void> {
    if (this.logForm.invalid) {
      return;
    }
    const value = this.logForm.getRawValue();
    const food = this.foods.find((candidate) => candidate.id === value.foodId);
    if (!food) {
      return;
    }
    const ratio = Number(value.grams) / food.servingSize;
    await this.dailyLogService.addFood({
      foodId: food.id!,
      foodName: food.name,
      grams: Number(value.grams),
      calories: Math.round(food.calories * ratio),
      protein: Math.round(food.protein * ratio),
      fat: Math.round(food.fat * ratio),
      carb: Math.round(food.carb * ratio),
      meal: value.meal as MealType
    });
    this.showDialog.set(false);
  }

  async remove(itemId: string): Promise<void> {
    await this.dailyLogService.removeFood(itemId);
  }
}
