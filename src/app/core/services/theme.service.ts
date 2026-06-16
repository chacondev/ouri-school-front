import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  isDark = signal(false);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('ouriplay-theme');
      if (saved === 'dark') this.apply(true);
    }
  }

  toggle() { this.apply(!this.isDark()); }

  private apply(dark: boolean) {
    this.isDark.set(dark);
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.classList.toggle('dark', dark);
      localStorage.setItem('ouriplay-theme', dark ? 'dark' : 'light');
    }
  }
}
