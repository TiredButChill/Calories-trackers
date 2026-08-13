export type ThemeMode = 'light' | 'dark';
export type Language = 'vi' | 'en';
export type FontSize = 'sm' | 'md' | 'lg';

export interface AppSettings {
  theme: ThemeMode;
  language: Language;
  fontSize: FontSize;
}
