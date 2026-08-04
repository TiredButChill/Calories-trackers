export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface DailyLogItem {
  id?: string;
  foodId: string;
  foodName: string;
  grams: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
  meal: MealType;
}

export interface DailyLog {
  date: string;
  items: DailyLogItem[];
}
