import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RaceComponent } from '../race/race.component';
import { RaceService } from '../race.service';
import { RaceModel } from '../models/race.model';
import { RacesComponent } from './races.component';

describe('RacesComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: RaceService, useValue: raceService }]
    });
    raceService.list.and.returnValue(
      of([
        { id: 1, name: 'Tokyo', startInstant: '2024-02-18T08:03:00' },
        { id: 2, name: 'Paris', startInstant: '2024-02-18T08:04:00' }
      ] as Array<RaceModel>)
    );
  });

  it('should display every race', () => {
    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();
    const debugElement = fixture.debugElement;
    const races = debugElement.queryAll(By.directive(RaceComponent));
    expect(races.length).withContext('You should have two `RaceComponent` displayed').toBe(2);
  });

  it('should display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(RacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const raceNames = element.querySelectorAll('a');
    expect(raceNames.length).withContext('You must have a link to go to the bet page for each race').toBe(2);
    expect(raceNames[0].textContent).toContain('Bet on Tokyo');
    expect(raceNames[1].textContent).toContain('Bet on Paris');
  });
});
