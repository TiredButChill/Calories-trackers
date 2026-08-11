import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, collection, collectionData, doc, docData, limit, orderBy, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { Observable, combineLatest, firstValueFrom, map, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { WorkoutScheduleService } from './workout-schedule.service';
import { WorkoutSession, WorkoutSet, WorkoutTemplate } from '../models';
import { dayOfWeekFromDate, toDateKey } from '../../shared/utils/date.util';

@Injectable({ providedIn: 'root' })
export class WorkoutSessionService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);
  private readonly workoutScheduleService = inject(WorkoutScheduleService);

  getByDate(date: string): Observable<WorkoutSession | null> {
    const dayOfWeek = dayOfWeekFromDate(date);
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [null];
        }
        const sessionDoc = doc(this.firestore, 'users', currentUser.uid, 'workoutSessions', date);
        return combineLatest([
          runInInjectionContext(this.injector, () => docData(sessionDoc)),
          this.workoutScheduleService.getTemplateForDay(dayOfWeek)
        ]).pipe(map(([data, template]) => (data as WorkoutSession) ?? this.buildPlannedSession(date, dayOfWeek, template)));
      })
    );
  }

  getToday(): Observable<WorkoutSession | null> {
    return this.getByDate(toDateKey());
  }

  getHistory(max = 50): Observable<WorkoutSession[]> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [[] as WorkoutSession[]];
        }
        const sessionsCollection = collection(this.firestore, 'users', currentUser.uid, 'workoutSessions');
        const historyQuery = query(sessionsCollection, where('status', '==', 'completed'), orderBy('date', 'desc'), limit(max));
        return runInInjectionContext(this.injector, () => collectionData(historyQuery)) as Observable<WorkoutSession[]>;
      })
    );
  }

  getSessionsInRange(startDate: string, endDate: string): Observable<WorkoutSession[]> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [[] as WorkoutSession[]];
        }
        const sessionsCollection = collection(this.firestore, 'users', currentUser.uid, 'workoutSessions');
        const rangeQuery = query(sessionsCollection, where('date', '>=', startDate), where('date', '<=', endDate), orderBy('date', 'asc'));
        return runInInjectionContext(this.injector, () => collectionData(rangeQuery)) as Observable<WorkoutSession[]>;
      })
    );
  }

  getMostRecentPrevious(exerciseId: string, beforeDate: string): Observable<WorkoutSession | null> {
    return this.authService.currentUser$.pipe(
      switchMap((currentUser) => {
        if (!currentUser) {
          return [null];
        }
        const sessionsCollection = collection(this.firestore, 'users', currentUser.uid, 'workoutSessions');
        const previousQuery = query(
          sessionsCollection,
          where('exerciseIds', 'array-contains', exerciseId),
          where('status', '==', 'completed'),
          where('date', '<', beforeDate),
          orderBy('date', 'desc'),
          limit(1)
        );
        return (runInInjectionContext(this.injector, () => collectionData(previousQuery)) as Observable<WorkoutSession[]>).pipe(
          map((sessions) => sessions[0] ?? null)
        );
      })
    );
  }

  async logSet(date: string, exerciseRowId: string, set: WorkoutSet): Promise<void> {
    const current = await firstValueFrom(this.getByDate(date));
    if (!current) {
      throw new Error('No workout scheduled for this date.');
    }
    const updated: WorkoutSession = {
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseRowId ? { ...exercise, sets: this.upsertSet(exercise.sets, set) } : exercise
      ),
      status: current.status === 'planned' ? 'in_progress' : current.status,
      startedAt: current.startedAt ?? new Date().toISOString()
    };
    await setDoc(this.getSessionDocRef(date), updated);
  }

  async removeSet(date: string, exerciseRowId: string, setNumber: number): Promise<void> {
    const current = await firstValueFrom(this.getByDate(date));
    if (!current) {
      return;
    }
    const updated: WorkoutSession = {
      ...current,
      exercises: current.exercises.map((exercise) =>
        exercise.id === exerciseRowId ? { ...exercise, sets: exercise.sets.filter((set) => set.setNumber !== setNumber) } : exercise
      )
    };
    await setDoc(this.getSessionDocRef(date), updated);
  }

  async addExerciseToSession(date: string, exercise: { exerciseId: string; exerciseName: string }): Promise<void> {
    const current = await firstValueFrom(this.getByDate(date));
    if (!current) {
      throw new Error('No workout scheduled for this date.');
    }
    const updated: WorkoutSession = {
      ...current,
      exercises: [...current.exercises, { id: crypto.randomUUID(), exerciseId: exercise.exerciseId, exerciseName: exercise.exerciseName, sets: [] }],
      exerciseIds: [...current.exerciseIds, exercise.exerciseId]
    };
    await setDoc(this.getSessionDocRef(date), updated);
  }

  async completeSession(date: string): Promise<void> {
    const current = await firstValueFrom(this.getByDate(date));
    if (!current) {
      return;
    }
    const completedAt = new Date();
    const durationSeconds = current.startedAt ? Math.max(0, Math.round((completedAt.getTime() - new Date(current.startedAt).getTime()) / 1000)) : undefined;
    const updated: WorkoutSession = {
      ...current,
      status: 'completed',
      completedAt: completedAt.toISOString(),
      durationSeconds
    };
    await setDoc(this.getSessionDocRef(date), updated);
  }

  reopenSession(date: string): Promise<void> {
    return updateDoc(this.getSessionDocRef(date), { status: 'in_progress' });
  }

  private buildPlannedSession(date: string, dayOfWeek: WorkoutSession['dayOfWeek'], template: WorkoutTemplate | null): WorkoutSession | null {
    if (!template) {
      return null;
    }
    return {
      date,
      dayOfWeek,
      templateId: template.id ?? null,
      templateName: template.name,
      status: 'planned',
      exercises: template.exercises.map((templateExercise) => ({
        id: crypto.randomUUID(),
        exerciseId: templateExercise.exerciseId,
        exerciseName: templateExercise.exerciseName,
        sets: []
      })),
      exerciseIds: template.exercises.map((templateExercise) => templateExercise.exerciseId)
    };
  }

  private upsertSet(sets: WorkoutSet[], set: WorkoutSet): WorkoutSet[] {
    const exists = sets.some((candidate) => candidate.setNumber === set.setNumber);
    const next = exists ? sets.map((candidate) => (candidate.setNumber === set.setNumber ? set : candidate)) : [...sets, set];
    return next.sort((a, b) => a.setNumber - b.setNumber);
  }

  private getSessionDocRef(date: string) {
    const uid = this.auth.currentUser?.uid;
    if (!uid) {
      throw new Error('No authenticated user.');
    }
    return doc(this.firestore, 'users', uid, 'workoutSessions', date);
  }
}
