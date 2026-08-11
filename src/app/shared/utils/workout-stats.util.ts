import { WorkoutSession, WorkoutSessionExercise, WorkoutSet } from '../../core/models';

export function estimatedOneRepMax(weight: number, reps: number): number {
  if (reps <= 0) {
    return 0;
  }
  return weight * (1 + reps / 30);
}

export function workingSets(sets: WorkoutSet[]): WorkoutSet[] {
  return sets.filter((set) => !set.isWarmup);
}

export function totalVolume(sets: WorkoutSet[]): number {
  return workingSets(sets).reduce((sum, set) => sum + set.weight * set.reps, 0);
}

export function totalReps(sets: WorkoutSet[]): number {
  return workingSets(sets).reduce((sum, set) => sum + set.reps, 0);
}

export function totalSetCount(sets: WorkoutSet[]): number {
  return workingSets(sets).length;
}

export function bestSet(sets: WorkoutSet[]): WorkoutSet | null {
  const candidates = workingSets(sets);
  if (candidates.length === 0) {
    return null;
  }
  return candidates.reduce((best, set) => {
    if (set.weight > best.weight) {
      return set;
    }
    if (set.weight === best.weight && set.reps > best.reps) {
      return set;
    }
    return best;
  });
}

export function maxEstimatedOneRepMax(sets: WorkoutSet[]): number {
  return workingSets(sets).reduce((max, set) => Math.max(max, estimatedOneRepMax(set.weight, set.reps)), 0);
}

export function exerciseVolume(exercise: WorkoutSessionExercise): number {
  return totalVolume(exercise.sets);
}

export function sessionVolume(session: WorkoutSession): number {
  return session.exercises.reduce((sum, exercise) => sum + exerciseVolume(exercise), 0);
}

export function sessionSetCount(session: WorkoutSession): number {
  return session.exercises.reduce((sum, exercise) => sum + totalSetCount(exercise.sets), 0);
}

export function sessionRepCount(session: WorkoutSession): number {
  return session.exercises.reduce((sum, exercise) => sum + totalReps(exercise.sets), 0);
}

export interface SessionComparison {
  currentVolume: number;
  previousVolume: number;
  volumeDeltaKg: number;
  volumeDeltaPercent: number;
}

export function compareExercises(current: WorkoutSessionExercise, previous: WorkoutSessionExercise | null): SessionComparison {
  const currentVolume = exerciseVolume(current);
  const previousVolume = previous ? exerciseVolume(previous) : 0;
  const volumeDeltaKg = currentVolume - previousVolume;
  const volumeDeltaPercent = previousVolume > 0 ? (volumeDeltaKg / previousVolume) * 100 : 0;
  return { currentVolume, previousVolume, volumeDeltaKg, volumeDeltaPercent };
}

export interface PersonalRecord {
  type: 'weight' | 'reps';
  weight: number;
  reps: number;
  previousBestWeight: number;
  previousBestReps: number;
}

export function detectPRs(current: WorkoutSessionExercise, previous: WorkoutSessionExercise | null): PersonalRecord[] {
  const previousWorkingSets = previous ? workingSets(previous.sets) : [];
  if (previousWorkingSets.length === 0) {
    return [];
  }
  const previousMaxWeight = Math.max(...previousWorkingSets.map((set) => set.weight));
  const records: PersonalRecord[] = [];

  for (const set of workingSets(current.sets)) {
    if (set.weight > previousMaxWeight) {
      records.push({ type: 'weight', weight: set.weight, reps: set.reps, previousBestWeight: previousMaxWeight, previousBestReps: 0 });
      continue;
    }
    const sameWeightPrevious = previousWorkingSets.filter((prevSet) => prevSet.weight === set.weight);
    if (sameWeightPrevious.length > 0) {
      const previousBestReps = Math.max(...sameWeightPrevious.map((prevSet) => prevSet.reps));
      if (set.reps > previousBestReps) {
        records.push({ type: 'reps', weight: set.weight, reps: set.reps, previousBestWeight: set.weight, previousBestReps });
      }
    }
  }

  return records;
}

export type DayStatus = 'planned' | 'completed' | 'missed' | 'rest';

export function resolveDayStatus(date: string, scheduledTemplateId: string | null, session: WorkoutSession | null, today: string = new Date().toISOString().slice(0, 10)): DayStatus {
  if (scheduledTemplateId === null) {
    return 'rest';
  }
  if (session?.status === 'completed') {
    return 'completed';
  }
  if (date < today) {
    return 'missed';
  }
  return 'planned';
}
