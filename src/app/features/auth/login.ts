import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { filter, firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentYear = new Date().getFullYear();
  readonly loading = signal(false);
  readonly error = signal('');

  async signIn(): Promise<void> {
    this.loading.set(true);
    this.error.set('');
    try {
      await this.authService.loginWithGoogle();
      // authGuard reads currentUser$, which updates asynchronously via Firebase's
      // onAuthStateChanged listener — wait for it to actually reflect the signed-in
      // user, otherwise navigateByUrl can race the guard and bounce back to /login.
      await firstValueFrom(this.authService.currentUser$.pipe(filter((currentUser) => !!currentUser)));
      await this.router.navigateByUrl('/dashboard');
    } catch {
      this.error.set('Đăng nhập thất bại. Vui lòng thử lại.');
    } finally {
      this.loading.set(false);
    }
  }
}
