export type MuscleGroup =
  | 'upper_chest'
  | 'mid_chest'
  | 'lower_chest'
  | 'lats'
  | 'upper_back'
  | 'traps'
  | 'lower_back'
  | 'front_delts'
  | 'side_delts'
  | 'rear_delts'
  | 'biceps'
  | 'triceps'
  | 'brachialis'
  | 'forearms'
  | 'abs'
  | 'obliques'
  | 'quads'
  | 'hamstrings'
  | 'glutes'
  | 'adductors'
  | 'abductors'
  | 'calves'
  | 'other';
export type Equipment = 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell' | 'other';

export interface Exercise {
  id?: string;
  name: string;
  muscleGroups: MuscleGroup[];
  equipment: Equipment;
  instructions?: string;
  createdBy: string;
}
