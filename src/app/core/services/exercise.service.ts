import { Injectable, Injector, inject, runInInjectionContext } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc, getDocs, limit, query, updateDoc, writeBatch } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';
import { Exercise, MuscleGroup } from '../models';

const FIRESTORE_BATCH_LIMIT = 500;

const DEFAULT_EXERCISES: Omit<Exercise, 'id'>[] = [
  // ─────────────────────────────────────────────
  // CHEST
  // ─────────────────────────────────────────────

  {
    name: 'Bench Press',
    muscleGroups: ['mid_chest', 'front_delts', 'triceps'],
    equipment: 'barbell',
    createdBy: 'system',
  },
  {
    name: 'Incline Dumbbell Press',
    muscleGroups: ['upper_chest', 'front_delts', 'triceps'],
    equipment: 'dumbbell',
    createdBy: 'system',
  },
  {
    name: 'Push Up',
    muscleGroups: ['mid_chest', 'triceps', 'front_delts', 'abs'],
    equipment: 'bodyweight',
    createdBy: 'system',
  },

  // ─────────────────────────────────────────────
  // BACK
  // ─────────────────────────────────────────────

  {
    name: 'Lat Pulldown',
    muscleGroups: ['lats', 'biceps', 'upper_back'],
    equipment: 'cable',
    createdBy: 'system',
  },
  {
    name: 'Barbell Row',
    muscleGroups: ['upper_back', 'lats', 'rear_delts', 'biceps'],
    equipment: 'barbell',
    createdBy: 'system',
  },
  {
    name: 'Pull Up',
    muscleGroups: ['lats', 'biceps', 'upper_back'],
    equipment: 'bodyweight',
    createdBy: 'system',
  },
  {
    name: 'Deadlift',
    muscleGroups: [
      'glutes',
      'hamstrings',
      'lower_back',
      'traps',
      'lats',
      'abs',
    ],
    equipment: 'barbell',
    createdBy: 'system',
  },

  // ─────────────────────────────────────────────
  // SHOULDERS
  // ─────────────────────────────────────────────

  {
    name: 'Overhead Press',
    muscleGroups: ['front_delts', 'side_delts', 'triceps'],
    equipment: 'barbell',
    createdBy: 'system',
  },
  {
    name: 'Lateral Raise',
    muscleGroups: ['side_delts'],
    equipment: 'dumbbell',
    createdBy: 'system',
  },
  {
    name: 'Rear Delt Fly',
    muscleGroups: ['rear_delts', 'upper_back'],
    equipment: 'dumbbell',
    createdBy: 'system',
  },

  // ─────────────────────────────────────────────
  // BICEPS / FOREARMS
  // ─────────────────────────────────────────────

  {
    name: 'Bicep Curl',
    muscleGroups: ['biceps'],
    equipment: 'dumbbell',
    createdBy: 'system',
  },
  {
    name: 'Hammer Curl',
    muscleGroups: ['brachialis', 'biceps', 'forearms'],
    equipment: 'dumbbell',
    createdBy: 'system',
  },

  // ─────────────────────────────────────────────
  // TRICEPS
  // ─────────────────────────────────────────────

  {
    name: 'Tricep Pushdown',
    muscleGroups: ['triceps'],
    equipment: 'cable',
    createdBy: 'system',
  },
  {
    name: 'Skull Crusher',
    muscleGroups: ['triceps'],
    equipment: 'barbell',
    createdBy: 'system',
  },

  // ─────────────────────────────────────────────
  // LEGS
  // ─────────────────────────────────────────────

  {
    name: 'Squat',
    muscleGroups: ['quads', 'glutes', 'adductors', 'abs'],
    equipment: 'barbell',
    createdBy: 'system',
  },
  {
    name: 'Leg Press',
    muscleGroups: ['quads', 'glutes', 'adductors'],
    equipment: 'machine',
    createdBy: 'system',
  },
  {
    name: 'Romanian Deadlift',
    muscleGroups: ['hamstrings', 'glutes', 'lower_back'],
    equipment: 'barbell',
    createdBy: 'system',
  },
  {
    name: 'Leg Curl',
    muscleGroups: ['hamstrings'],
    equipment: 'machine',
    createdBy: 'system',
  },

  // ─────────────────────────────────────────────
  // CORE
  // ─────────────────────────────────────────────

  {
    name: 'Plank',
    muscleGroups: ['abs', 'obliques', 'lower_back'],
    equipment: 'bodyweight',
    createdBy: 'system',
  },
  {
    name: 'Cable Crunch',
    muscleGroups: ['abs'],
    equipment: 'cable',
    createdBy: 'system',
  },
];

@Injectable({ providedIn: 'root' })
export class ExerciseService {
  private readonly firestore = inject(Firestore);
  private readonly injector = inject(Injector);
  private readonly exercisesCollection = collection(this.firestore, 'exercises');

  getExercises(): Observable<Exercise[]> {
    return (runInInjectionContext(this.injector, () => collectionData(this.exercisesCollection, { idField: 'id' })) as Observable<(Exercise & { muscleGroup?: MuscleGroup })[]>).pipe(
      // older exercises were saved with a single `muscleGroup` field before it became `muscleGroups`; normalize on read.
      map((exercises) => exercises.map((exercise) => ({ ...exercise, muscleGroups: exercise.muscleGroups ?? (exercise.muscleGroup ? [exercise.muscleGroup] : []) })))
    );
  }

  searchExercises(term: string, muscleGroup?: MuscleGroup): Observable<Exercise[]> {
    const normalized = term.trim().toLowerCase();
    return this.getExercises().pipe(
      map((exercises) =>
        exercises
          .filter((exercise) => !normalized || exercise.name.toLowerCase().includes(normalized))
          .filter((exercise) => !muscleGroup || exercise.muscleGroups.includes(muscleGroup))
      )
    );
  }

  addExercise(exercise: Exercise): Promise<void> {
    return addDoc(this.exercisesCollection, exercise).then(() => undefined);
  }

  updateExercise(id: string, changes: Partial<Exercise>): Promise<void> {
    return updateDoc(doc(this.firestore, 'exercises', id), changes);
  }

  deleteExercise(id: string): Promise<void> {
    return deleteDoc(doc(this.firestore, 'exercises', id));
  }

  async bulkAddExercises(exercises: Exercise[]): Promise<number> {
    for (let i = 0; i < exercises.length; i += FIRESTORE_BATCH_LIMIT) {
      const batch = writeBatch(this.firestore);
      for (const exercise of exercises.slice(i, i + FIRESTORE_BATCH_LIMIT)) {
        batch.set(doc(this.exercisesCollection), exercise);
      }
      await batch.commit();
    }
    return exercises.length;
  }

  async ensureSeeded(): Promise<void> {
    const snapshot = await runInInjectionContext(this.injector, () => getDocs(query(this.exercisesCollection, limit(1))));
    if (!snapshot.empty) {
      return;
    }
    await Promise.all(DEFAULT_EXERCISES.map((exercise) => addDoc(this.exercisesCollection, exercise)));
  }
}
