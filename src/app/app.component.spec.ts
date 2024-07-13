import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should have a title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('h1')!.textContent).withContext('You should have an `h1` with the text Ponyracer').toContain('Ponyracer');
  });
});
