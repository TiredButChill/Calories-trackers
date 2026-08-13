import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { WorkoutSessionService } from '../../../core/services/workout-session.service';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { sessionRepCount, sessionSetCount, sessionVolume } from '../../../shared/utils/workout-stats.util';

@Component({
  selector: 'app-workout-history',
  standalone: true,
  imports: [CommonModule, RouterLink, CardModule, TagModule, TranslatePipe],
  templateUrl: './workout-history.html'
})
export class WorkoutHistory {
  private readonly workoutSessionService = inject(WorkoutSessionService);

  sessions$ = this.workoutSessionService.getHistory();

  sessionVolume = sessionVolume;
  sessionSetCount = sessionSetCount;
  sessionRepCount = sessionRepCount;
}
