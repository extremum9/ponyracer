import { Injectable } from '@angular/core';
import { getBrowserLang } from '@jsverse/transloco';

const LANGUAGE_STORAGE_KEY = 'preferred-lang';

@Injectable()
export class I18nService {
  public readonly availableLangs: Readonly<string[]> = ['en', 'fr'];
  public readonly lang: string;

  constructor(private _window: Window) {
    const preferredLang = this._window.localStorage.getItem(LANGUAGE_STORAGE_KEY) ?? getBrowserLang() ?? 'en';
    this.lang = this.availableLangs.includes(preferredLang) ? preferredLang : 'en';
    this._window.document.documentElement.lang = this.lang;
  }

  public changeLanguage(lang: string): void {
    this._window.localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    this._window.location.reload();
  }
}
