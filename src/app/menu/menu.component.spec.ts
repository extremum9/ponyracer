import { TestBed } from '@angular/core/testing';
import { provideRouter, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { MenuComponent } from './menu.component';

describe('MenuComponent', () => {
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    userService = jasmine.createSpyObj<UserService>('UserService', [], {
      userEvents: new BehaviorSubject<UserModel | null>(null)
    });
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: UserService, useValue: userService }]
    });
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar')!;
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should have the class `collapse`')
      .toContain('collapse');

    const button = element.querySelector('button')!;
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.click();

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar')!;
    expect(navbar.classList)
      .withContext('The element with the id `#navbar` should have not the class `collapse` after a click')
      .not.toContain('collapse');
  });

  it('should use routerLink to navigate', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).withContext('You should have only one routerLink to the home when the user is not logged').toBe(1);

    userService.userEvents.next({ login: 'cedric', money: 2000 } as UserModel);
    fixture.detectChanges();

    const linksAfterLogin = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(linksAfterLogin.length).withContext('You should have two routerLink: one to the races, one to the home').toBe(2);
  });

  it('should display the user if logged in', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    userService.userEvents.next({ login: 'cedric', money: 2000 } as UserModel);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const info = element.querySelector('#current-user')!;
    expect(info).withContext('You should have a `span` element with the ID `current-user` to display the user info').not.toBeNull();
    expect(info.textContent).withContext('You should display the name of the user in a `span` element').toContain('cedric');
    expect(info.textContent).withContext('You should display the score of the user in a `span` element').toContain('2,000');
  });

  it('should unsubscribe on destruction', () => {
    const userService = TestBed.inject(UserService);
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    expect(userService.userEvents.observed).withContext('You need to subscribe to userEvents when the component is created').toBeTrue();
    fixture.destroy();

    expect(userService.userEvents.observed)
      .withContext('You need to unsubscribe from userEvents when the component is destroyed')
      .toBeFalse();
  });
});
