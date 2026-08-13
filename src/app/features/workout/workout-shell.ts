import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-workout-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, TranslatePipe],
  templateUrl: './workout-shell.html'
})
export class WorkoutShell {
  readonly subNavItems = [
    { path: '/workout/today', labelKey: 'workout.nav.today' },
    { path: '/workout/schedule', labelKey: 'workout.nav.schedule' },
    { path: '/workout/templates', labelKey: 'workout.nav.templates' },
    { path: '/workout/exercises', labelKey: 'workout.nav.exercises' },
    { path: '/workout/history', labelKey: 'workout.nav.history' },
    { path: '/workout/progress', labelKey: 'workout.nav.progress' },
    { path: '/workout/calendar', labelKey: 'workout.nav.calendar' }
  ];
}
