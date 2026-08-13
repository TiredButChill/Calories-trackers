import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { TranslationService } from '../../core/services/translation.service';
import { FontSize, Language, ThemeMode } from '../../core/models';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, CardModule, SelectButtonModule, TranslatePipe],
  templateUrl: './settings.html'
})
export class Settings {
  private readonly appSettingsService = inject(AppSettingsService);
  private readonly translationService = inject(TranslationService);

  readonly prefs = this.appSettingsService.prefs;

  getThemeOptions(): { label: string; value: ThemeMode }[] {
    return [
      { label: this.translationService.t('settings.themeLight'), value: 'light' },
      { label: this.translationService.t('settings.themeDark'), value: 'dark' }
    ];
  }

  getLanguageOptions(): { label: string; value: Language }[] {
    return [
      { label: this.translationService.t('settings.languageVi'), value: 'vi' },
      { label: this.translationService.t('settings.languageEn'), value: 'en' }
    ];
  }

  getFontSizeOptions(): { label: string; value: FontSize }[] {
    return [
      { label: this.translationService.t('settings.fontSizeSm'), value: 'sm' },
      { label: this.translationService.t('settings.fontSizeMd'), value: 'md' },
      { label: this.translationService.t('settings.fontSizeLg'), value: 'lg' }
    ];
  }

  setTheme(theme: ThemeMode): void {
    void this.appSettingsService.setTheme(theme);
  }

  setLanguage(language: Language): void {
    void this.appSettingsService.setLanguage(language);
  }

  setFontSize(fontSize: FontSize): void {
    void this.appSettingsService.setFontSize(fontSize);
  }
}
