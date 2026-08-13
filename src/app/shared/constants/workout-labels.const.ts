import { DayOfWeek, Equipment, MuscleGroup } from '../../core/models';

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  // Chest
  upper_chest: 'workout.muscle.upperChest',
  mid_chest: 'workout.muscle.midChest',
  lower_chest: 'workout.muscle.lowerChest',

  // Back
  lats: 'workout.muscle.lats',
  upper_back: 'workout.muscle.upperBack',
  traps: 'workout.muscle.traps',
  lower_back: 'workout.muscle.lowerBack',

  // Shoulders
  front_delts: 'workout.muscle.frontDelts',
  side_delts: 'workout.muscle.sideDelts',
  rear_delts: 'workout.muscle.rearDelts',

  // Arms
  biceps: 'workout.muscle.biceps',
  triceps: 'workout.muscle.triceps',
  forearms: 'workout.muscle.forearms',
  brachialis: 'workout.muscle.brachialis',

  // Core
  abs: 'workout.muscle.abs',
  obliques: 'workout.muscle.obliques',

  // Legs
  quads: 'workout.muscle.quads',
  hamstrings: 'workout.muscle.hamstrings',
  glutes: 'workout.muscle.glutes',
  adductors: 'workout.muscle.adductors',
  abductors: 'workout.muscle.abductors',
  calves: 'workout.muscle.calves',

  // Other
  other: 'workout.muscle.other',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'workout.equipment.barbell',
  dumbbell: 'workout.equipment.dumbbell',
  machine: 'workout.equipment.machine',
  cable: 'workout.equipment.cable',
  bodyweight: 'workout.equipment.bodyweight',
  kettlebell: 'workout.equipment.kettlebell',
  other: 'workout.equipment.other'
};

export const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'mon', label: 'workout.day.mon' },
  { value: 'tue', label: 'workout.day.tue' },
  { value: 'wed', label: 'workout.day.wed' },
  { value: 'thu', label: 'workout.day.thu' },
  { value: 'fri', label: 'workout.day.fri' },
  { value: 'sat', label: 'workout.day.sat' },
  { value: 'sun', label: 'workout.day.sun' }
];

export const WORKOUT_STATUS_LABELS: Record<'planned' | 'in_progress' | 'completed', string> = {
  planned: 'workout.status.planned',
  in_progress: 'workout.status.inProgress',
  completed: 'workout.status.completed'
};
