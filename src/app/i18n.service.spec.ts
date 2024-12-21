import { I18nService } from './i18n.service';

const LANGUAGE_STORAGE_KEY = 'preferred-lang';

describe('I18nService', () => {
  it('should get the preferred language from local storage when created', () => {
    const getItemSpy = spyOn(Storage.prototype, 'getItem').and.returnValue('fr');
    const service = new I18nService(window);
    expect(service.lang).toBe('fr');
    expect(getItemSpy).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY);
  });

  it('should fall back to the browser language when no preferred language is found', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    spyOnProperty(window.navigator, 'languages').and.returnValue(['fr']);
    const service = new I18nService(window);
    expect(service.lang).toBe('fr');
  });

  it('should fall back to English when the browser language is not available', () => {
    spyOn(Storage.prototype, 'getItem').and.returnValue(null);
    spyOnProperty(Navigator.prototype, 'languages').and.returnValue([]);
    spyOnProperty(Navigator.prototype, 'language').and.returnValue('');
    const service = new I18nService(window);
    expect(service.lang).toBe('en');
  });

  it('should change the language and store the preference', () => {
    const setItemSpy = spyOn(Storage.prototype, 'setItem');
    const mockWindow = {
      location: { reload: jasmine.createSpy() },
      localStorage: { getItem: () => 'en', setItem: setItemSpy },
      document: { documentElement: { lang: '' } }
    } as unknown as Window;
    const service = new I18nService(mockWindow);
    service.changeLanguage('fr');
    expect(setItemSpy).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, 'fr');
    expect(mockWindow.location.reload).toHaveBeenCalled();
  });
});
