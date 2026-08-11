import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { map } from 'rxjs';
import { WorkoutScheduleService } from '../../../core/services/workout-schedule.service';
import { WorkoutTemplateService } from '../../../core/services/workout-template.service';
import { DayOfWeek } from '../../../core/models';
import { DAYS_OF_WEEK } from '../../../shared/constants/workout-labels.const';

@Component({
  selector: 'app-workout-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, SelectModule],
  templateUrl: './workout-schedule.html'
})
export class WorkoutSchedule {
  private readonly workoutScheduleService = inject(WorkoutScheduleService);
  private readonly workoutTemplateService = inject(WorkoutTemplateService);

  readonly days = DAYS_OF_WEEK;
  schedule$ = this.workoutScheduleService.getSchedule();

  templateOptions$ = this.workoutTemplateService.getTemplates().pipe(
    map((templates) => [{ label: 'Nghỉ', value: null }, ...templates.map((template) => ({ label: template.name, value: template.id ?? null }))])
  );

  copySourceOptions(day: DayOfWeek) {
    return this.days.filter((candidate) => candidate.value !== day);
  }

  async assignDay(day: DayOfWeek, templateId: string | null): Promise<void> {
    await this.workoutScheduleService.assignDay(day, templateId);
  }

  async copyDay(sourceDay: DayOfWeek, targetDay: DayOfWeek): Promise<void> {
    await this.workoutScheduleService.copyDay(sourceDay, targetDay);
  }
}
