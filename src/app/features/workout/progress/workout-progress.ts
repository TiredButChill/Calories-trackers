import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { SelectModule } from 'primeng/select';
import { combineLatest, map, of, switchMap } from 'rxjs';
import { ExerciseService } from '../../../core/services/exercise.service';
import { TranslationService } from '../../../core/services/translation.service';
import { WorkoutProgressService } from '../../../core/services/workout-progress.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { MUSCLE_GROUP_LABELS } from '../../../shared/constants/workout-labels.const';
import { toDateKey } from '../../../shared/utils/date.util';

const MUSCLE_GROUP_CHART_COLORS = [
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#6b7280',
  '#84cc16',
  '#06b6d4',
  '#f97316',
  '#a855f7',
  '#f43f5e',
  '#22c55e',
  '#eab308',
  '#0ea5e9',
  '#d946ef',
  '#64748b',
  '#fb7185',
  '#4ade80',
  '#facc15',
  '#38bdf8',
  '#c084fc'
];

@Component({
  selector: 'app-workout-progress',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, ChartModule, SelectModule, TranslatePipe],
  templateUrl: './workout-progress.html'
})
export class WorkoutProgress {
  private readonly exerciseService = inject(ExerciseService);
  private readonly workoutProgressService = inject(WorkoutProgressService);
  private readonly translationService = inject(TranslationService);

  readonly selectedExerciseId = signal<string | null>(null);
  exerciseOptions$ = this.exerciseService.getExercises().pipe(map((list) => list.map((exercise) => ({ label: exercise.name, value: exercise.id }))));

  strengthChartData$ = toObservable(this.selectedExerciseId).pipe(
    switchMap((exerciseId) => (exerciseId ? this.workoutProgressService.getExerciseTrend(exerciseId) : of([]))),
    map((points) => ({
      labels: points.map((point) => point.date.slice(5)),
      datasets: [
        {
          label: this.translationService.t('workout.progress.estOneRmDataset'),
          data: points.map((point) => point.estOneRm),
          borderColor: '#3b82f6',
          backgroundColor: '#3b82f6',
          tension: 0.3
        },
        {
          label: this.translationService.t('workout.progress.maxWeightDataset'),
          data: points.map((point) => point.maxWeight),
          borderColor: '#10b981',
          backgroundColor: '#10b981',
          tension: 0.3
        }
      ]
    }))
  );

  weeklyVolumeChartData$ = this.workoutProgressService.getWeeklyVolume(8).pipe(
    map((points) => ({
      labels: points.map((point) => point.weekStart.slice(5)),
      datasets: [{ label: this.translationService.t('workout.progress.volumeDataset'), data: points.map((point) => point.totalVolume), backgroundColor: '#3b82f6' }]
    }))
  );

  muscleGroupChartData$ = combineLatest([of(this.startOfWindow()), of(toDateKey())]).pipe(
    switchMap(([start, end]) => this.workoutProgressService.getMuscleGroupVolume(start, end)),
    map((totals) => {
      const entries = (Object.entries(totals) as [keyof typeof MUSCLE_GROUP_LABELS, number][])
        .filter(([, count]) => count > 0)
        .sort(([, a], [, b]) => b - a);
      return {
        labels: entries.map(([group]) => this.translationService.t(MUSCLE_GROUP_LABELS[group])),
        datasets: [
          {
            label: this.translationService.t('workout.progress.setsDataset'),
            data: entries.map(([, count]) => count),
            backgroundColor: entries.map((_, index) => MUSCLE_GROUP_CHART_COLORS[index % MUSCLE_GROUP_CHART_COLORS.length])
          }
        ]
      };
    })
  );

  chartOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#64748b' } } }, scales: { x: { ticks: { color: '#64748b' } }, y: { ticks: { color: '#64748b' } } } };

  private startOfWindow(): string {
    const date = new Date();
    date.setDate(date.getDate() - 28);
    return toDateKey(date);
  }
}
