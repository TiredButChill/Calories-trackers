import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import { DailyLogService } from './daily-log.service';
import { GoalService } from './goal.service';
import { Goal } from '../models';

export interface MacroSummary {
  consumed: number;
  goal: number;
  remaining: number;
  progress: number;
}

export interface DashboardSummary {
  calories: MacroSummary;
  protein: MacroSummary;
  fat: MacroSummary;
  carb: MacroSummary;
}

function toMacroSummary(consumed: number, goal: number): MacroSummary {
  return {
    consumed,
    goal,
    remaining: goal - consumed,
    progress: goal > 0 ? Math.round((consumed / goal) * 100) : 0
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly dailyLogService = inject(DailyLogService);
  private readonly goalService = inject(GoalService);

  getTodaySummary(): Observable<DashboardSummary> {
    return combineLatest([this.dailyLogService.getToday(), this.goalService.getGoal()]).pipe(map(([log, goal]) => this.buildSummary(log.items, goal)));
  }

  private buildSummary(items: { calories: number; protein: number; fat: number; carb: number }[], goal: Goal): DashboardSummary {
    const totals = items.reduce(
      (acc, item) => ({
        calories: acc.calories + item.calories,
        protein: acc.protein + item.protein,
        fat: acc.fat + item.fat,
        carb: acc.carb + item.carb
      }),
      { calories: 0, protein: 0, fat: 0, carb: 0 }
    );

    return {
      calories: toMacroSummary(totals.calories, goal.calories),
      protein: toMacroSummary(totals.protein, goal.protein),
      fat: toMacroSummary(totals.fat, goal.fat),
      carb: toMacroSummary(totals.carb, goal.carb)
    };
  }
}
