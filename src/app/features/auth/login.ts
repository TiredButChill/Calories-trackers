import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { filter, firstValueFrom } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule, TranslatePipe],
  templateUrl: './login.html'
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

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
      this.error.set(this.translationService.t('auth.signInError'));
    } finally {
      this.loading.set(false);
    }
  }
}
