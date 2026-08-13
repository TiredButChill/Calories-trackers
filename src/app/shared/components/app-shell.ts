import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../core/services/auth.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, RouterOutlet, ButtonModule, TranslatePipe],
  templateUrl: './app-shell.html'
})
export class AppShell {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly navItems = [
    { path: '/dashboard', labelKey: 'nav.dashboard', icon: 'pi-chart-bar', exact: true },
    { path: '/log', labelKey: 'nav.log', icon: 'pi-book', exact: true },
    { path: '/foods', labelKey: 'nav.foods', icon: 'pi-box', exact: true },
    { path: '/goals', labelKey: 'nav.goals', icon: 'pi-flag', exact: true },
    { path: '/weight', labelKey: 'nav.weight', icon: 'pi-chart-line', exact: true },
    { path: '/workout', labelKey: 'nav.workout', icon: 'pi-bolt', exact: false }
  ];

  async logout(): Promise<void> {
    await this.authService.logout();
    await this.router.navigateByUrl('/login');
  }
}
