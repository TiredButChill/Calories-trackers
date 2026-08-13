import { DayOfWeek } from '../../core/models';

export function toDateKey(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const DAY_INDEX_TO_DAY_OF_WEEK: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export function dayOfWeekFromDate(date: string): DayOfWeek {
  const [year, month, day] = date.split('-').map(Number);
  return DAY_INDEX_TO_DAY_OF_WEEK[new Date(year, month - 1, day).getDay()];
}

export function startOfWeek(date: Date = new Date()): Date {
  const result = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const isoDayIndex = (result.getDay() + 6) % 7; // Monday = 0
  result.setDate(result.getDate() - isoDayIndex);
  return result;
}

export function weekStartKey(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return toDateKey(startOfWeek(new Date(year, month - 1, day)));
}
