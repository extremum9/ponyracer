import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { RaceModel } from '../../models/race.model';
import { RaceComponent } from '../../race/race.component';
import { RaceService } from '../../race.service';
import { FinishedRacesComponent } from './finished-races.component';

describe('FinishedRacesComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.configureTestingModule({
      providers: [{ provide: RaceService, useValue: raceService }]
    });
    raceService.list.and.returnValue(
      of([
        { id: 1, name: 'Lyon', startInstant: '2024-02-18T08:02:00' },
        { id: 2, name: 'Los Angeles', startInstant: '2024-02-18T08:03:00' }
      ] as Array<RaceModel>)
    );
  });

  it('should display every race', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    const debugElement = fixture.debugElement;
    const raceNames = debugElement.queryAll(By.directive(RaceComponent));
    expect(raceNames.length).withContext('You should have two `RaceComponent` displayed').toBe(2);
  });

  it('should not display a link to bet on a race', () => {
    const fixture = TestBed.createComponent(FinishedRacesComponent);
    fixture.detectChanges();

    const element = fixture.nativeElement as HTMLElement;
    const raceNames = element.querySelectorAll('a');
    expect(raceNames.length).withContext('You must NOT have a link to go to the bet page for each race').toBe(0);
  });
});
