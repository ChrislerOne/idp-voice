import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly storageKey = 'theme';
  dark = signal(this.loadTheme());

  toggle(): void {
    this.dark.update(v => !v);
    localStorage.setItem(this.storageKey, this.dark() ? 'dark' : 'light');
    this.apply();
  }

  apply(): void {
    document.documentElement.setAttribute('data-theme', this.dark() ? 'dark' : 'light');
  }

  private loadTheme(): boolean {
    const stored = localStorage.getItem(this.storageKey);
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}
