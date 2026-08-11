import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { WorkoutScheduleService } from '../../../core/services/workout-schedule.service';
import { WorkoutTemplateService } from '../../../core/services/workout-template.service';

@Component({
  selector: 'app-workout-templates',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ButtonModule, CardModule, DialogModule, InputTextModule],
  templateUrl: './workout-templates.html'
})
export class WorkoutTemplates {
  private readonly fb = inject(FormBuilder);
  private readonly workoutTemplateService = inject(WorkoutTemplateService);
  private readonly workoutScheduleService = inject(WorkoutScheduleService);
  private readonly router = inject(Router);

  readonly showDialog = signal(false);
  templates$ = this.workoutTemplateService.getTemplates();

  templateForm = this.fb.group({
    name: ['', Validators.required]
  });

  async submit(): Promise<void> {
    if (this.templateForm.invalid) {
      return;
    }
    const name = this.templateForm.getRawValue().name!;
    const id = await this.workoutTemplateService.addTemplate({ name, exercises: [] });
    this.templateForm.reset({ name: '' });
    this.showDialog.set(false);
    await this.router.navigate(['/workout/templates', id]);
  }

  async remove(id: string): Promise<void> {
    await this.workoutTemplateService.deleteTemplate(id);
    await this.workoutScheduleService.unassignTemplate(id);
  }
}
