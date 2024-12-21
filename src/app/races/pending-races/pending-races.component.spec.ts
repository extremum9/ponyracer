import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { provideI18nTesting } from '../../../i18n-test';
import { RaceModel } from '../../models/race.model';
import { RaceComponent } from '../../race/race.component';
import { RaceService } from '../../race.service';
import { PendingRacesComponent } from './pending-races.component';

describe('PendingRacesComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.configureTestingModule({
      providers: [provideI18nTesting(), provideRouter([]), { provide: RaceService, useValue: raceService }]
    });
    raceService.list.and.returnValue(
      of([
        { id: 1, name: 'Lyon', startInstant: '2024-02-18T08:02:00' },
        { id: 2, name: 'Los Angeles', startInstant: '2024-02-18T08:03:00' }
      ] as Array<RaceModel>)
    );
  });

  it('should display every race', () => {
    const fixture = TestBed.createComponent(PendingRacesComponent);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).withContext('You should have two `RaceComponent` displayed').toBe(2);
  });

  it('should display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(PendingRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const raceNames = element.querySelectorAll('a');
    expect(raceNames.length).withContext('You must have a link to go to the bet page for each race').toBe(2);
    expect(raceNames[0].textContent).toContain('Bet on Lyon');
    expect(raceNames[1].textContent).toContain('Bet on Los Angeles');
  });
});
