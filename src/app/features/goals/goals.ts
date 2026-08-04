import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputNumberModule } from 'primeng/inputnumber';
import { take } from 'rxjs';
import { GoalService } from '../../core/services/goal.service';

@Component({
  selector: 'app-goals',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonModule, CardModule, InputNumberModule],
  templateUrl: './goals.html'
})
export class Goals {
  private readonly fb = inject(FormBuilder);
  private readonly goalService = inject(GoalService);

  readonly saved = signal(false);

  goalForm = this.fb.group({
    calories: [2000, Validators.required],
    protein: [120, Validators.required],
    fat: [70, Validators.required],
    carb: [250, Validators.required]
  });

  constructor() {
    this.goalService.getGoal().pipe(take(1)).subscribe((goal) => this.goalForm.patchValue(goal));
  }

  async submit(): Promise<void> {
    if (this.goalForm.invalid) {
      return;
    }
    const value = this.goalForm.getRawValue();
    await this.goalService.setGoal({
      calories: Number(value.calories),
      protein: Number(value.protein),
      fat: Number(value.fat),
      carb: Number(value.carb)
    });
    this.saved.set(true);
    setTimeout(() => this.saved.set(false), 2000);
  }
}
