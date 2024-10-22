import { signal, WritableSignal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router, RouterLink } from '@angular/router';
import { By } from '@angular/platform-browser';
import { NgbCollapseConfig } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../user.service';
import { UserModel } from '../models/user.model';
import { MenuComponent } from './menu.component';
import { of, Subject } from 'rxjs';

describe('MenuComponent', () => {
  let currentUser: WritableSignal<UserModel | null>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    currentUser = signal(null);
    userService = jasmine.createSpyObj<UserService>('UserService', ['logout', 'scoreUpdates'], { currentUser });
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: UserService, useValue: userService }]
    });
    userService.scoreUpdates.and.returnValue(of());
    // turn off the animation for the collapse
    const collapseConfig = TestBed.inject(NgbCollapseConfig);
    collapseConfig.animation = false;
  });

  it('should toggle the class on click', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    const element = fixture.nativeElement as HTMLElement;

    fixture.detectChanges();

    const navbarCollapsed = element.querySelector('#navbar')!;
    expect(navbarCollapsed).withContext('No element with the id `#navbar`').not.toBeNull();
    expect(navbarCollapsed.classList)
      .withContext('The element with the id `#navbar` should use the `ngbCollapse` directive')
      .not.toContain('show');

    const button = element.querySelector('button')!;
    expect(button).withContext('No `button` element to collapse the menu').not.toBeNull();
    button.click();

    fixture.detectChanges();

    const navbar = element.querySelector('#navbar')!;
    expect(navbar.classList).withContext('The element with the id `#navbar` should use the `ngbCollapse` directive').toContain('show');
  });

  it('should use routerLink to navigate', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    fixture.detectChanges();

    const links = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(links.length).withContext('You should have only one routerLink to the home when the user is not logged').toBe(1);

    currentUser.set({ login: 'cedric', money: 2000 } as UserModel);
    fixture.detectChanges();

    const linksAfterLogin = fixture.debugElement.queryAll(By.directive(RouterLink));
    expect(linksAfterLogin.length).withContext('You should have two routerLink: one to the races, one to the home').toBe(2);
  });

  it('should display the user if logged in', () => {
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    currentUser.set({ login: 'cedric', money: 2000 } as UserModel);

    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const info = element.querySelector('#current-user')!;
    expect(info).withContext('You should have a `span` element with the ID `current-user` to display the user info').not.toBeNull();
    expect(info.textContent).withContext('You should display the name of the user in a `span` element').toContain('cedric');
    expect(info.textContent).withContext('You should display the score of the user in a `span` element').toContain('2,000');
  });

  it('should listen to score updates', () => {
    const fixture = TestBed.createComponent(MenuComponent);

    // emulate a login
    const scoreUpdates = new Subject<UserModel>();
    userService.scoreUpdates.and.returnValue(scoreUpdates);
    const user = { id: 1, login: 'cedric', money: 200 } as UserModel;
    currentUser.set(user);
    fixture.detectChanges();

    expect(fixture.componentInstance.user()).withContext('Your component should listen to the user changes').toBe(user);
    expect(userService.scoreUpdates).toHaveBeenCalledWith(user.id);

    // emulate a score update
    user.money = 300;
    scoreUpdates.next(user);

    expect(fixture.componentInstance.user()!.money).withContext('Your component should listen to the `scoreUpdates` observable').toBe(300);

    // emulate an error
    scoreUpdates.error('You should catch potential errors on score updates with a `.catchError()`');
    expect(fixture.componentInstance.user()!.money).withContext('Your component should catch error on score updates').toBe(300);

    // emulate a score update
    user.money = 400;
    scoreUpdates.next(user);

    expect(fixture.componentInstance.user()!.money).withContext('Your component should catch error on score updates').toBe(400);

    // emulate a logout
    currentUser.set(null);
    fixture.detectChanges();

    expect(fixture.componentInstance.user()).withContext('Your component should listen to the user changes').toBe(null);
  });

  it('should display a logout button', () => {
    const router = TestBed.inject(Router);
    spyOn(router, 'navigateByUrl');
    const fixture = TestBed.createComponent(MenuComponent);
    fixture.detectChanges();

    currentUser.set({ login: 'cedric', money: 2000 } as UserModel);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const logout = element.querySelector<HTMLSpanElement>('span.fa-power-off')!;
    expect(logout).withContext('You should have a span element with a class `fa-power-off` to log out').not.toBeNull();
    logout.click();

    fixture.detectChanges();
    expect(userService.logout).toHaveBeenCalled();
    expect(router.navigateByUrl).toHaveBeenCalledWith('/');
  });
});
