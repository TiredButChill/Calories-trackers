import { HttpClient } from '@angular/common/http';
import { Injectable, effect, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { AppSettingsService } from './app-settings.service';
import { Language } from '../models';

const NAMESPACES = ['common', 'nav', 'auth', 'dashboard', 'daily-log', 'foods', 'goals', 'weight', 'settings', 'workout'] as const;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);
  private readonly appSettingsService = inject(AppSettingsService);

  private readonly dictionary = signal<Record<string, string>>({});

  constructor() {
    effect(() => {
      const language = this.appSettingsService.prefs().language;
      this.loadDictionary(language);
    });
  }

  t(key: string): string {
    return this.dictionary()[key] ?? key;
  }

  private loadDictionary(language: Language): void {
    forkJoin(
      NAMESPACES.map((namespace) =>
        this.http.get<Record<string, string>>(`i18n/${language}/${namespace}.json`).pipe(catchError(() => of({} as Record<string, string>)))
      )
    ).subscribe((results) => {
      const merged: Record<string, string> = {};
      NAMESPACES.forEach((namespace, index) => {
        for (const [key, value] of Object.entries(results[index])) {
          merged[`${namespace}.${key}`] = value;
        }
      });
      this.dictionary.set(merged);
    });
  }
}
