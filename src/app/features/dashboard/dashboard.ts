import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { catchError, of, tap } from 'rxjs';
import { DashboardService } from '../../core/services/dashboard.service';
import { WorkoutSessionService } from '../../core/services/workout-session.service';
import { WORKOUT_STATUS_LABELS } from '../../shared/constants/workout-labels.const';
import { sessionSetCount, sessionVolume } from '../../shared/utils/workout-stats.util';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, ProgressBarModule, TagModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  private readonly workoutSessionService = inject(WorkoutSessionService);

  readonly summary$ = this.dashboardService.getTodaySummary();
  readonly todayWorkoutError = signal('');
  readonly todayWorkout$ = this.workoutSessionService.getToday().pipe(
    tap(() => this.todayWorkoutError.set('')),
    catchError((error) => {
      console.error('Failed to load today’s workout', error);
      this.todayWorkoutError.set('Không tải được dữ liệu tập luyện hôm nay.');
      return of(null);
    })
  );
  readonly statusLabels = WORKOUT_STATUS_LABELS;

  sessionVolume = sessionVolume;
  sessionSetCount = sessionSetCount;

  clampProgress(value: number): number {
    return Math.min(100, Math.max(0, value));
  }
}
