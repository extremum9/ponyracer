import { importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideTranslocoMissingHandler, TranslocoMissingHandler, TranslocoTestingModule } from '@jsverse/transloco';
import { I18nService } from './app/i18n.service';
import en from './app/i18n/en.json';
import fr from './app/i18n/fr.json';
// The app config import is to make sure that the locale data are imported correctly
import './app/app.config';

class ThrowingMissingHandler implements TranslocoMissingHandler {
  handle(key: string): never {
    throw new Error(`missing translation for key: ${key}`);
  }
}

export function provideI18nTesting(lang: 'en' | 'fr' = 'en') {
  return [
    importProvidersFrom(
      TranslocoTestingModule.forRoot({
        langs: { en, fr },
        translocoConfig: {
          availableLangs: ['en', 'fr'],
          defaultLang: lang
        },
        preloadLangs: true
      })
    ),
    provideTranslocoMissingHandler(ThrowingMissingHandler),
    { provide: LOCALE_ID, useValue: lang },
    {
      provide: I18nService,
      useValue: jasmine.createSpyObj<I18nService>('I18nService', ['changeLanguage'], {
        availableLangs: ['en', 'fr'],
        lang
      })
    }
  ];
}
