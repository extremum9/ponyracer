import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideI18nTesting } from '../../i18n-test';
import { UserModel } from '../models/user.model';
import { UserService } from '../user.service';
import { HomeComponent } from './home.component';

describe('HomeComponent', () => {
  let currentUser: WritableSignal<UserModel | null>;

  function prepare(lang: 'en' | 'fr') {
    currentUser = signal(null);
    const userService = jasmine.createSpyObj<UserService>('UserService', [], { currentUser });
    TestBed.configureTestingModule({
      providers: [provideI18nTesting(lang), provideRouter([]), { provide: UserService, useValue: userService }]
    });
  }

  describe('in English', () => {
    beforeEach(() => prepare('en'));

    it('display the title and quote', () => {
      const fixture = TestBed.createComponent(HomeComponent);
      const element: HTMLElement = fixture.nativeElement;
      fixture.detectChanges();

      const title = element.querySelector('h1')!;
      expect(title).withContext('You should have an `h1` element to display the title').not.toBeNull();
      expect(title.textContent).toContain('Ponyracer');
      expect(title.textContent)
        .withContext('You should have the `small` element inside the `h1` element')
        .toContain('Always a pleasure to bet on ponies');

      const subtitle = element.querySelector('small')!;
      expect(subtitle).withContext('You should have a `small` element to display the subtitle').not.toBeNull();
      expect(subtitle.textContent).withContext('The subtitle should have a text').toContain('Always a pleasure to bet on ponies');
    });

    it('display a link to go the login and another to register', () => {
      const fixture = TestBed.createComponent(HomeComponent);
      const element: HTMLElement = fixture.nativeElement;
      fixture.detectChanges();

      const button = element.querySelector('a[href="/users/login"]')!;
      expect(button)
        .withContext('You should have an `a` element to display the link to the login. Maybe you forgot to use `routerLink`?')
        .not.toBeNull();
      expect(button.textContent).withContext('The link should have a text').toContain('Login');

      const buttonRegister = element.querySelector('a[href="/users/register"]')!;
      expect(buttonRegister)
        .withContext('You should have an `a` element to display the link to the register page. Maybe you forgot to use `routerLink`?')
        .not.toBeNull();
      expect(buttonRegister.textContent).withContext('The link should have a text').toContain('Register');
    });

    it('should display only a link to go the races page if logged in', () => {
      const fixture = TestBed.createComponent(HomeComponent);
      fixture.detectChanges();

      currentUser.set({ login: 'cedric' } as UserModel);
      fixture.detectChanges();

      const element: HTMLElement = fixture.nativeElement;
      const button = element.querySelector('a[href="/races"]')!;
      expect(button).withContext('The link should lead to the races if the user is logged in').not.toBeNull();
      expect(button.textContent).withContext('The link should have a text').toContain('Races');
    });
  });

  describe('in French', () => {
    beforeEach(() => prepare('fr'));

    it('translate the texts', () => {
      const fixture = TestBed.createComponent(HomeComponent);
      const element: HTMLElement = fixture.nativeElement;
      fixture.detectChanges();

      const title = element.querySelector('h1')!;
      expect(title).withContext('You should have an `h1` element to display the title').not.toBeNull();
      expect(title.textContent).toContain('Ponyracer');

      const subtitle = element.querySelector('small')!;
      expect(subtitle.textContent)
        .withContext('You should have a `small` element to display the subtitle in French')
        .toContain('Toujours un plaisir de parier sur des poneys');

      const loginButton = element.querySelector('a[href="/users/login"]')!;
      expect(loginButton.textContent).withContext('The login link should have a text in French').toContain('Connexion');

      const registerButton = element.querySelector('a[href="/users/register"]')!;
      expect(registerButton.textContent).withContext('The register link should have a text in French').toContain('Enregistrement');

      currentUser.set({ login: 'cedric' } as UserModel);
      fixture.detectChanges();

      const racesButton = element.querySelector('a[href="/races"]')!;
      expect(racesButton.textContent).withContext('The races link should have a text in French').toContain('Courses');
    });
  });
});
