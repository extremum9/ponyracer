import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { of, Subject } from 'rxjs';
import { RaceService } from '../race.service';
import { PonyModel, PonyWithPositionModel } from '../models/pony.model';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { LiveComponent } from './live.component';

@Component({
  selector: 'pr-pony',
  template: '<div>{{ ponyModel().name }}</div>',
  standalone: true
})
class PonyStubComponent {
  ponyModel = input.required<PonyModel>();
  isRunning = input(false);
}

describe('LiveComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;
  const race = {
    id: 12,
    name: 'Lyon',
    status: 'PENDING',
    ponies: [],
    startInstant: '2024-02-18T08:02:00'
  } as RaceModel;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['get', 'live']);
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'races/:raceId/live', component: LiveComponent }]),
        { provide: RaceService, useValue: raceService }
      ]
    });
    TestBed.overrideComponent(LiveComponent, {
      remove: {
        imports: [PonyComponent]
      },
      add: {
        imports: [PonyStubComponent]
      }
    });
  });

  it('should display the title', async () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(of([]));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    const title = element.querySelector('h1')!;
    expect(title).withContext('The template should display an h1 element with the race name inside').not.toBeNull();
    expect(title.textContent).withContext('The template should display an h1 element with the race name inside').toContain('Lyon');
  });

  it('should subscribe to the live observable', async () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(of([]));
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    expect(raceService.live).toHaveBeenCalledWith(12);
  });

  it('should unsubscribe on destruction', async () => {
    raceService.get.and.returnValue(of(race));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);
    expect(positions.observed).withContext('You need to subscribe to raceService.live when the component is created').toBeTrue();

    harness.fixture.destroy();

    expect(positions.observed).withContext('You need to unsubscribe from raceService.live when the component is destroyed').toBeFalse();
  });

  it('should display a div with a pony component per pony', async () => {
    raceService.get.and.returnValue(of(race));
    raceService.live.and.returnValue(
      of([
        { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
        { id: 2, name: 'Awesome Fridge', color: 'Green', position: 40 }
      ])
    );
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    const divWithPonies = element.querySelectorAll('div.pony-wrapper');
    expect(divWithPonies.length).withContext('You should display a `div` with a class `pony-wrapper` for each pony').toBe(2);

    const debugElement = harness.routeDebugElement!;
    const ponyComponents = debugElement.queryAll(By.directive(PonyStubComponent));
    expect(ponyComponents).withContext('You should display a `PonyComponent` for each pony').not.toBeNull();
    expect(ponyComponents.length).withContext('You should display a `PonyComponent` for each pony').toBe(2);

    const sunnySunday = ponyComponents[0].componentInstance as PonyStubComponent;
    expect(sunnySunday.isRunning()).withContext('Each pony should be running (use the `isRunning` input)').toBeTruthy();

    const sunnySundayDiv = divWithPonies[0];
    expect(sunnySundayDiv.getAttribute('style'))
      .withContext('The `margin-left` style should match the position of the pony in percent minus 5')
      .toBe('margin-left: 5%;');
  });
});
