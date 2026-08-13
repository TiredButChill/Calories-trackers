import { DayOfWeek, ScheduleOverride, WeekSchedule } from '../../core/models';

export function applyScheduleOverride(base: WeekSchedule, override: ScheduleOverride): WeekSchedule {
  const result: WeekSchedule = { ...base };
  for (const from of Object.keys(override) as DayOfWeek[]) {
    result[from] = null;
  }
  for (const [from, to] of Object.entries(override) as [DayOfWeek, DayOfWeek][]) {
    result[to] = base[from];
  }
  return result;
}

export function sourceDayFor(day: DayOfWeek, override: ScheduleOverride): DayOfWeek | null {
  const entry = (Object.entries(override) as [DayOfWeek, DayOfWeek][]).find(([, to]) => to === day);
  return entry ? entry[0] : null;
}
