import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Observable, combineLatest, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { ExerciseService } from './exercise.service';
import { WorkoutScheduleService } from './workout-schedule.service';
import { WorkoutSessionService } from './workout-session.service';
import { MuscleGroup, WorkoutSession } from '../models';
import { toDateKey, startOfWeek } from '../../shared/utils/date.util';
import { bestSet, exerciseVolume, maxEstimatedOneRepMax, totalSetCount } from '../../shared/utils/workout-stats.util';

export interface ExerciseTrendPoint {
  date: string;
  maxWeight: number;
  estOneRm: number;
  volume: number;
}

export interface WeeklyVolumePoint {
  weekStart: string;
  totalVolume: number;
}

export interface WeekSummary {
  planned: number;
  completed: number;
}

@Injectable({ providedIn: 'root' })
export class WorkoutProgressService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);
  private readonly authService = inject(AuthService);
  private readonly exerciseService = inject(ExerciseService);
  private readonly workoutScheduleService = inject(WorkoutScheduleService);
  private readonly workoutSessionService = inject(WorkoutSessionService);

  getExerciseTrend(exerciseId: string, sessionCount = 12): Observable<ExerciseTrendPoint[]> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [[] as WorkoutSession[]];
        }
        const sessionsCollection = collection(this.firestore, 'users', currentUser.uid, 'workoutSessions');
        const trendQuery = query(
          sessionsCollection,
          where('exerciseIds', 'array-contains', exerciseId),
          where('status', '==', 'completed'),
          orderBy('date', 'desc'),
          limit(sessionCount)
        );
        return runInInjectionContext(this.injector, () => collectionData(trendQuery)) as Observable<WorkoutSession[]>;
      }),
      map((sessions) =>
        sessions
          .map((session) => {
            const exercise = session.exercises.find((candidate) => candidate.exerciseId === exerciseId);
            if (!exercise) {
              return null;
            }
            return {
              date: session.date,
              maxWeight: bestSet(exercise.sets)?.weight ?? 0,
              estOneRm: Math.round(maxEstimatedOneRepMax(exercise.sets)),
              volume: exerciseVolume(exercise)
            };
          })
          .filter((point): point is ExerciseTrendPoint => point !== null)
          .reverse()
      )
    );
  }

  getWeeklyVolume(weeksCount = 8): Observable<WeeklyVolumePoint[]> {
    const weekStarts = this.lastWeekStarts(weeksCount);
    const rangeStart = toDateKey(weekStarts[0]);
    const rangeEnd = toDateKey(new Date());

    return this.workoutSessionService.getSessionsInRange(rangeStart, rangeEnd).pipe(
      map((sessions) => {
        const completed = sessions.filter((session) => session.status === 'completed');
        return weekStarts.map((weekStart) => {
          const weekEnd = new Date(weekStart);
          weekEnd.setDate(weekEnd.getDate() + 6);
          const weekStartKey = toDateKey(weekStart);
          const weekEndKey = toDateKey(weekEnd);
          const totalVolume = completed
            .filter((session) => session.date >= weekStartKey && session.date <= weekEndKey)
            .reduce((sum, session) => sum + session.exercises.reduce((exSum, exercise) => exSum + exerciseVolume(exercise), 0), 0);
          return { weekStart: weekStartKey, totalVolume };
        });
      })
    );
  }

  getMuscleGroupVolume(startDate: string, endDate: string): Observable<Record<MuscleGroup, number>> {
    return combineLatest([this.workoutSessionService.getSessionsInRange(startDate, endDate), this.exerciseService.getExercises()]).pipe(
      map(([sessions, exercises]) => {
        const muscleGroupsByExerciseId = new Map(exercises.map((exercise) => [exercise.id, exercise.muscleGroups]));
        const totals: Record<MuscleGroup, number> = { upper_chest: 0, mid_chest: 0, lower_chest: 0, lats: 0, upper_back: 0, traps: 0, lower_back: 0, front_delts: 0, side_delts: 0, rear_delts: 0, biceps: 0, triceps: 0, brachialis: 0, forearms: 0, abs: 0, obliques: 0, quads: 0, hamstrings: 0, glutes: 0, adductors: 0, abductors: 0, calves: 0, other: 0 };
        for (const session of sessions) {
          if (session.status !== 'completed') {
            continue;
          }
          for (const exercise of session.exercises) {
            const muscleGroups = muscleGroupsByExerciseId.get(exercise.exerciseId);
            const setCount = totalSetCount(exercise.sets);
            for (const muscleGroup of muscleGroups && muscleGroups.length > 0 ? muscleGroups : (['other'] as MuscleGroup[])) {
              totals[muscleGroup] += setCount;
            }
          }
        }
        return totals;
      })
    );
  }

  getWeekSummary(weekStart: Date = startOfWeek()): Observable<WeekSummary> {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    const weekStartKey = toDateKey(weekStart);
    const weekEndKey = toDateKey(weekEnd);

    return combineLatest([this.workoutScheduleService.getSchedule(), this.workoutSessionService.getSessionsInRange(weekStartKey, weekEndKey)]).pipe(
      map(([schedule, sessions]) => ({
        planned: Object.values(schedule).filter((templateId) => templateId !== null).length,
        completed: sessions.filter((session) => session.status === 'completed').length
      }))
    );
  }

  private lastWeekStarts(weeksCount: number): Date[] {
    const currentWeekStart = startOfWeek();
    const starts: Date[] = [];
    for (let i = weeksCount - 1; i >= 0; i--) {
      const weekStart = new Date(currentWeekStart);
      weekStart.setDate(weekStart.getDate() - i * 7);
      starts.push(weekStart);
    }
    return starts;
  }
}
