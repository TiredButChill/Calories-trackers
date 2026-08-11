export interface WorkoutTemplateExercise {
  id: string;
  exerciseId: string;
  exerciseName: string;
  // Optional: a template is primarily a list of exercises for a given day (Push/Pull/Legs/...).
  // Target sets/reps are an optional hint, not a requirement — actual numbers are logged per session.
  sets?: number;
  repsMin?: number;
  repsMax?: number;
}

export interface WorkoutTemplate {
  id?: string;
  name: string;
  exercises: WorkoutTemplateExercise[];
}
