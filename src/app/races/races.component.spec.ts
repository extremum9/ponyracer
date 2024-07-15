import { TestBed } from '@angular/core/testing';
import { RacesComponent } from './races.component';

describe('RacesComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display every race', () => {
    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const raceNames = element.querySelectorAll('h2');
    expect(raceNames.length).withContext('You should have an `h2` element per race in your template').toBe(2);
    expect(raceNames[0].textContent).toContain('Lyon');
    expect(raceNames[1].textContent).toContain('London');
  });
});
