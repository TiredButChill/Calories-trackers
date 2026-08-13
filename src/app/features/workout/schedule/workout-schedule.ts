import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { combineLatest, map } from 'rxjs';
import { ScheduleOverrideService } from '../../../core/services/schedule-override.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WorkoutScheduleService } from '../../../core/services/workout-schedule.service';
import { WorkoutSessionService } from '../../../core/services/workout-session.service';
import { WorkoutTemplateService } from '../../../core/services/workout-template.service';
import { DayOfWeek } from '../../../core/models';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { DAYS_OF_WEEK } from '../../../shared/constants/workout-labels.const';
import { startOfWeek, toDateKey } from '../../../shared/utils/date.util';
import { applyScheduleOverride, sourceDayFor } from '../../../shared/utils/schedule-override.util';
import { DayStatus, resolveDayStatus } from '../../../shared/utils/workout-stats.util';

interface WeekDayView {
  day: DayOfWeek;
  label: string;
  date: string;
  templateName: string | null;
  status: DayStatus;
  movedTo: DayOfWeek | null;
  movedFrom: DayOfWeek | null;
  canReschedule: boolean;
  targetOptions: { value: DayOfWeek; label: string }[];
}

@Component({
  selector: 'app-workout-schedule',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, SelectModule, ButtonModule, TranslatePipe],
  templateUrl: './workout-schedule.html'
})
export class WorkoutSchedule {
  private readonly workoutScheduleService = inject(WorkoutScheduleService);
  private readonly workoutTemplateService = inject(WorkoutTemplateService);
  private readonly workoutSessionService = inject(WorkoutSessionService);
  private readonly scheduleOverrideService = inject(ScheduleOverrideService);
  private readonly translationService = inject(TranslationService);

  readonly days = DAYS_OF_WEEK;
  readonly today = toDateKey();
  readonly weekStart = toDateKey(startOfWeek());

  schedule$ = this.workoutScheduleService.getSchedule();

  templateOptions$ = this.workoutTemplateService.getTemplates().pipe(
    map((templates) => [
      { label: this.translationService.t('workout.schedule.rest'), value: null },
      ...templates.map((template) => ({ label: template.name, value: template.id ?? null }))
    ])
  );

  weekDays$ = combineLatest([
    this.schedule$,
    this.workoutTemplateService.getTemplates(),
    this.scheduleOverrideService.getOverride(this.weekStart),
    this.workoutSessionService.getSessionsInRange(this.weekStart, this.weekEnd())
  ]).pipe(
    map(([schedule, templates, override, sessions]) => {
      const templateNameById = new Map(templates.map((template) => [template.id, template.name]));
      const sessionByDate = new Map(sessions.map((session) => [session.date, session]));
      const effectiveSchedule = applyScheduleOverride(schedule, override);
      const weekStartDate = startOfWeek();

      const views: WeekDayView[] = this.days.map((day, index) => {
        const date = new Date(weekStartDate);
        date.setDate(date.getDate() + index);
        const dateKey = toDateKey(date);
        const templateId = effectiveSchedule[day.value];
        const session = sessionByDate.get(dateKey) ?? null;
        const status = resolveDayStatus(dateKey, templateId, session, this.today);
        return {
          day: day.value,
          label: day.label,
          date: dateKey,
          templateName: templateId ? (templateNameById.get(templateId) ?? null) : null,
          status,
          movedTo: override[day.value] ?? null,
          movedFrom: sourceDayFor(day.value, override),
          canReschedule: (status === 'planned' || status === 'missed') && !session,
          targetOptions: []
        };
      });

      for (const view of views) {
        view.targetOptions = views
          .filter((candidate) => candidate.status === 'rest' && candidate.date >= this.today && candidate.day !== view.day)
          .map((candidate) => ({ value: candidate.day, label: `${this.translationService.t(candidate.label)} (${candidate.date.slice(5)})` }));
      }

      return views;
    })
  );

  dayLabel(day: DayOfWeek): string {
    const key = this.days.find((candidate) => candidate.value === day)?.label ?? day;
    return this.translationService.t(key);
  }

  copySourceOptions(day: DayOfWeek) {
    return this.days
      .filter((candidate) => candidate.value !== day)
      .map((candidate) => ({ value: candidate.value, label: this.translationService.t(candidate.label) }));
  }

  async assignDay(day: DayOfWeek, templateId: string | null): Promise<void> {
    await this.workoutScheduleService.assignDay(day, templateId);
  }

  async copyDay(sourceDay: DayOfWeek, targetDay: DayOfWeek): Promise<void> {
    await this.workoutScheduleService.copyDay(sourceDay, targetDay);
  }

  async rescheduleDay(fromDay: DayOfWeek, toDay: DayOfWeek | null): Promise<void> {
    if (!toDay) {
      return;
    }
    await this.scheduleOverrideService.rescheduleDay(this.weekStart, fromDay, toDay);
  }

  async cancelReschedule(fromDay: DayOfWeek): Promise<void> {
    await this.scheduleOverrideService.cancelReschedule(this.weekStart, fromDay);
  }

  private weekEnd(): string {
    const end = startOfWeek();
    end.setDate(end.getDate() + 6);
    return toDateKey(end);
  }
}
