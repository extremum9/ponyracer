import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { MenuComponent } from './menu/menu.component';

describe('AppComponent', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [provideRouter([])]
    })
  );

  it('should have a router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const element = fixture.nativeElement as HTMLElement;
    const routerOutlet = element.querySelector('router-outlet');
    expect(routerOutlet).withContext('You need a RouterOutlet component in your root component').not.toBeNull();
  });

  it('should use the menu component', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.debugElement;
    expect(element.query(By.directive(MenuComponent)))
      .withContext('You probably forgot to add MenuComponent to the AppComponent template')
      .not.toBeNull();
  });
});
