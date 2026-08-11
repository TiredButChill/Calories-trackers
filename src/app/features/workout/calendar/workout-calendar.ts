import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { combineLatest, map, switchMap } from 'rxjs';
import { WorkoutScheduleService } from '../../../core/services/workout-schedule.service';
import { WorkoutSessionService } from '../../../core/services/workout-session.service';
import { WorkoutSession } from '../../../core/models';
import { dayOfWeekFromDate, toDateKey } from '../../../shared/utils/date.util';
import { DayStatus, resolveDayStatus } from '../../../shared/utils/workout-stats.util';

interface DayCell {
  date: string | null;
  day: number | null;
  status: DayStatus | null;
}

const STATUS_CLASS: Record<DayStatus, string> = {
  completed: 'bg-green-500 text-white',
  planned: 'bg-surface-200 dark:bg-surface-700 text-surface-700 dark:text-surface-200',
  missed: 'bg-red-200 dark:bg-red-900 text-red-700 dark:text-red-200',
  rest: 'bg-transparent text-surface-400'
};

@Component({
  selector: 'app-workout-calendar',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './workout-calendar.html'
})
export class WorkoutCalendar {
  private readonly workoutSessionService = inject(WorkoutSessionService);
  private readonly workoutScheduleService = inject(WorkoutScheduleService);
  private readonly router = inject(Router);

  readonly today = toDateKey();
  readonly currentMonth = signal(this.startOfMonth(new Date()));
  readonly statusClass = STATUS_CLASS;

  view$ = toObservable(this.currentMonth).pipe(
    switchMap((month) => {
      const start = new Date(month.getFullYear(), month.getMonth(), 1);
      const end = new Date(month.getFullYear(), month.getMonth() + 1, 0);
      const startKey = toDateKey(start);
      const endKey = toDateKey(end);
      return combineLatest([this.workoutSessionService.getSessionsInRange(startKey, endKey), this.workoutScheduleService.getSchedule()]).pipe(
        map(([sessions, schedule]) => this.buildGrid(month, sessions, schedule))
      );
    })
  );

  previousMonth(): void {
    const month = this.currentMonth();
    this.currentMonth.set(this.startOfMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1)));
  }

  nextMonth(): void {
    const month = this.currentMonth();
    this.currentMonth.set(this.startOfMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1)));
  }

  openDay(date: string | null, status: DayStatus | null): void {
    if (!date || status === 'rest') {
      return;
    }
    if (status === 'completed') {
      this.router.navigate(['/workout/history', date]);
    } else if (date === this.today) {
      this.router.navigate(['/workout/today']);
    }
  }

  private buildGrid(month: Date, sessions: WorkoutSession[], schedule: Record<string, string | null>) {
    const sessionByDate = new Map(sessions.map((session) => [session.date, session]));
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const leadingBlanks = (firstDay.getDay() + 6) % 7; // Monday-start

    const cells: DayCell[] = [];
    for (let i = 0; i < leadingBlanks; i++) {
      cells.push({ date: null, day: null, status: null });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const dateKey = toDateKey(date);
      const dayOfWeek = dayOfWeekFromDate(dateKey);
      const scheduledTemplateId = schedule[dayOfWeek] ?? null;
      const session = sessionByDate.get(dateKey) ?? null;
      cells.push({ date: dateKey, day, status: resolveDayStatus(dateKey, scheduledTemplateId, session, this.today) });
    }
    while (cells.length % 7 !== 0) {
      cells.push({ date: null, day: null, status: null });
    }

    const weeks: DayCell[][] = [];
    for (let i = 0; i < cells.length; i += 7) {
      weeks.push(cells.slice(i, i + 7));
    }

    return { monthLabel: `Tháng ${month.getMonth() + 1}/${month.getFullYear()}`, weeks };
  }

  private startOfMonth(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }
}
