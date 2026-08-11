import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-workout-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './workout-shell.html'
})
export class WorkoutShell {
  readonly subNavItems = [
    { path: '/workout/today', label: 'Hôm nay' },
    { path: '/workout/schedule', label: 'Lịch tập' },
    { path: '/workout/templates', label: 'Bài tập mẫu' },
    { path: '/workout/exercises', label: 'Thư viện bài tập' },
    { path: '/workout/history', label: 'Lịch sử' },
    { path: '/workout/progress', label: 'Tiến độ' },
    { path: '/workout/calendar', label: 'Lịch' }
  ];
}
