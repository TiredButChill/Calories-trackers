import { Injectable, Injector, inject, runInInjectionContext, signal } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { Firestore, doc, docData, setDoc } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { AuthService } from './auth.service';
import { AppSettings, FontSize, Language, ThemeMode } from '../models';

const STORAGE_KEY = 'app-settings';
const DEFAULT_SETTINGS: AppSettings = { theme: 'light', language: 'vi', fontSize: 'md' };

@Injectable({ providedIn: 'root' })
export class AppSettingsService {
  private readonly firestore = inject(Firestore);
  private readonly auth = inject(Auth);
  private readonly authService = inject(AuthService);
  private readonly injector = inject(Injector);

  readonly prefs = signal<AppSettings>(DEFAULT_SETTINGS);

  constructor() {
    const cached = this.readLocalStorage();
    this.prefs.set(cached);
    this.applyDomEffects(cached);

    this.authService.currentUser$
      .pipe(
        switchMap((currentUser) => {
          if (!currentUser) {
            return of(null);
          }
          const settingsDoc = doc(this.firestore, 'users', currentUser.uid, 'settings', 'appPreferences');
          return runInInjectionContext(this.injector, () => docData(settingsDoc)) as Observable<Partial<AppSettings> | undefined>;
        })
      )
      .subscribe((data) => {
        if (!data) {
          return;
        }
        const merged: AppSettings = { ...DEFAULT_SETTINGS, ...data };
        this.prefs.set(merged);
        this.applyDomEffects(merged);
        this.writeLocalStorage(merged);
      });
  }

  setTheme(theme: ThemeMode): Promise<void> {
    return this.updatePrefs({ theme });
  }

  setLanguage(language: Language): Promise<void> {
    return this.updatePrefs({ language });
  }

  setFontSize(fontSize: FontSize): Promise<void> {
    return this.updatePrefs({ fontSize });
  }

  private async updatePrefs(changes: Partial<AppSettings>): Promise<void> {
    const next: AppSettings = { ...this.prefs(), ...changes };
    this.prefs.set(next);
    this.applyDomEffects(next);
    this.writeLocalStorage(next);

    const uid = this.auth.currentUser?.uid;
    if (uid) {
      const settingsDoc = doc(this.firestore, 'users', uid, 'settings', 'appPreferences');
      await setDoc(settingsDoc, changes, { merge: true });
    }
  }

  private applyDomEffects(settings: AppSettings): void {
    const root = document.documentElement;
    root.classList.toggle('app-dark', settings.theme === 'dark');
    root.classList.remove('font-sm', 'font-lg');
    if (settings.fontSize === 'sm' || settings.fontSize === 'lg') {
      root.classList.add(`font-${settings.fontSize}`);
    }
    root.lang = settings.language;
  }

  private readLocalStorage(): AppSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  private writeLocalStorage(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }
}
