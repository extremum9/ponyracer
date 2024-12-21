import '@angular/common/locales/global/fr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, Injectable, isDevMode, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { routes } from './app.routes';
import { jwtInterceptor } from './jwt.interceptor';
import { provideTransloco, Translation, TranslocoLoader } from '@jsverse/transloco';
import { I18nService } from './i18n.service';

@Injectable({ providedIn: 'root' })
export class TranslocoModuleLoader implements TranslocoLoader {
  getTranslation(lang: string): Promise<Translation> {
    return import(`./i18n/${lang}.json`).then((m: { default: Translation }) => m.default);
  }
}

const i18nService = new I18nService(window);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([jwtInterceptor])),
    provideTransloco({
      config: {
        availableLangs: [...i18nService.availableLangs],
        defaultLang: i18nService.lang,
        prodMode: !isDevMode()
      },
      loader: TranslocoModuleLoader
    }),
    { provide: LOCALE_ID, useValue: i18nService.lang },
    { provide: I18nService, useValue: i18nService }
  ]
};
