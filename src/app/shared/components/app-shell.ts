import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ButtonModule],
  templateUrl: './app-shell.html'
})
export class AppShell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly navItems = [
    { path: '/dashboard', label: 'Hôm nay', icon: 'pi-chart-bar', exact: true },
    { path: '/log', label: 'Nhật ký', icon: 'pi-book', exact: true },
    { path: '/foods', label: 'Món ăn', icon: 'pi-box', exact: true },
    { path: '/goals', label: 'Mục tiêu', icon: 'pi-flag', exact: true },
    { path: '/weight', label: 'Cân nặng', icon: 'pi-chart-line', exact: true }
  ];

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
