import { DayOfWeek } from './workout-schedule.model';

export type WorkoutSessionStatus = 'planned' | 'in_progress' | 'completed';

export interface WorkoutSet {
  setNumber: number;
  weight: number;
  reps: number;
  rir?: number;
  isWarmup: boolean;
  completed: boolean;
}

export interface WorkoutSessionExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  sets: WorkoutSet[];
}

export interface WorkoutSession {
  date: string;
  dayOfWeek: DayOfWeek;
  templateId: string | null;
  templateName: string | null;
  status: WorkoutSessionStatus;
  startedAt?: string;
  completedAt?: string;
  durationSeconds?: number;
  exercises: WorkoutSessionExercise[];
  exerciseIds: string[];
}
