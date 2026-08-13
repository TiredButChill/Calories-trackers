import { DayOfWeek } from './workout-schedule.model';

/** Key = ngày gốc trong lịch lặp lại, value = ngày trong cùng tuần mà buổi tập được dời tới. */
export type ScheduleOverride = Partial<Record<DayOfWeek, DayOfWeek>>;
