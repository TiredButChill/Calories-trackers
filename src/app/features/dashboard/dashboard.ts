import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ProgressBarModule } from 'primeng/progressbar';
import { DashboardService } from '../../core/services/dashboard.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CardModule, ProgressBarModule],
  templateUrl: './dashboard.html'
})
export class Dashboard {
  private readonly dashboardService = inject(DashboardService);
  readonly summary$ = this.dashboardService.getTodaySummary();

  clampProgress(value: number): number {
    return Math.min(100, Math.max(0, value));
  }
}
