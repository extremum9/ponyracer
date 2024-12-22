import { inject, LOCALE_ID, Pipe, PipeTransform } from '@angular/core';
import { formatDistanceToNowStrict, Locale, parseISO } from 'date-fns';
import { enUS, fr } from 'date-fns/locale';

const locales: Record<string, Locale> = {
  en: enUS,
  fr: fr
};

@Pipe({
  name: 'fromNow',
  standalone: true
})
export class FromNowPipe implements PipeTransform {
  localeId = inject(LOCALE_ID);
  public transform(value: string): string {
    const date = parseISO(value);
    return formatDistanceToNowStrict(date, { addSuffix: true, locale: locales[this.localeId] });
  }
}
