import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { WorkoutSessionService } from '../../../core/services/workout-session.service';
import { exerciseVolume, sessionRepCount, sessionSetCount, sessionVolume, totalSetCount } from '../../../shared/utils/workout-stats.util';

@Component({
  selector: 'app-workout-history-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TagModule],
  templateUrl: './workout-history-detail.html'
})
export class WorkoutHistoryDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly workoutSessionService = inject(WorkoutSessionService);

  session$ = this.workoutSessionService.getByDate(this.route.snapshot.paramMap.get('date')!);

  sessionVolume = sessionVolume;
  sessionSetCount = sessionSetCount;
  sessionRepCount = sessionRepCount;
  exerciseVolume = exerciseVolume;
  totalSetCount = totalSetCount;

  formatDuration(seconds?: number): string {
    if (!seconds) {
      return '-';
    }
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    return hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }
}
