export interface Food {
  id?: string;
  name: string;
  servingSize: number;
  calories: number;
  protein: number;
  fat: number;
  carb: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  createdBy: string;
}
