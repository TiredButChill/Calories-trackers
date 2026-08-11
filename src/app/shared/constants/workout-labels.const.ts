import { DayOfWeek, Equipment, MuscleGroup } from '../../core/models';

export const MUSCLE_GROUP_LABELS: Record<MuscleGroup, string> = {
  // Chest
  upper_chest: 'Ngực trên',
  mid_chest: 'Ngực giữa',
  lower_chest: 'Ngực dưới',

  // Back
  lats: 'Xô',
  upper_back: 'Lưng trên',
  traps: 'Cầu vai',
  lower_back: 'Lưng dưới',

  // Shoulders
  front_delts: 'Vai trước',
  side_delts: 'Vai giữa',
  rear_delts: 'Vai sau',

  // Arms
  biceps: 'Tay trước',
  triceps: 'Tay sau',
  forearms: 'Cẳng tay',
  brachialis: 'Cơ cánh tay',

  // Core
  abs: 'Cơ bụng',
  obliques: 'Cơ liên sườn',

  // Legs
  quads: 'Đùi trước',
  hamstrings: 'Đùi sau',
  glutes: 'Mông',
  adductors: 'Đùi trong',
  abductors: 'Đùi ngoài',
  calves: 'Bắp chân',

  // Other
  other: 'Khác',
};

export const EQUIPMENT_LABELS: Record<Equipment, string> = {
  barbell: 'Tạ đòn',
  dumbbell: 'Tạ đơn',
  machine: 'Máy',
  cable: 'Cáp',
  bodyweight: 'Thân thể',
  kettlebell: 'Kettlebell',
  other: 'Khác'
};

export const DAYS_OF_WEEK: { value: DayOfWeek; label: string }[] = [
  { value: 'mon', label: 'Thứ 2' },
  { value: 'tue', label: 'Thứ 3' },
  { value: 'wed', label: 'Thứ 4' },
  { value: 'thu', label: 'Thứ 5' },
  { value: 'fri', label: 'Thứ 6' },
  { value: 'sat', label: 'Thứ 7' },
  { value: 'sun', label: 'Chủ nhật' }
];

export const WORKOUT_STATUS_LABELS: Record<'planned' | 'in_progress' | 'completed', string> = {
  planned: 'Chưa bắt đầu',
  in_progress: 'Đang tập',
  completed: 'Hoàn thành'
};
