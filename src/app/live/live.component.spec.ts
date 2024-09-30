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

  it('should change the race status once the race is RUNNING', async () => {
    raceService.get.and.returnValue(of({ ...race }));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    // there is no flag displayed as the race is PENDING
    expect(harness.routeNativeElement!.querySelector('.fa-flag')).toBeNull();

    positions.next([{ id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0 }]);
    harness.detectChanges();

    // there is a flag displayed as the race is RUNNING
    expect(harness.routeNativeElement!.querySelector('.fa-flag')).not.toBeNull();

    expect(raceService.get).toHaveBeenCalledWith(12);
    expect(raceService.live).toHaveBeenCalledWith(12);
  });

  it('should unsubscribe on destruction', async () => {
    raceService.get.and.returnValue(of({ ...race }));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);
    expect(positions.observed).withContext('You need to subscribe to raceService.live when the component is created').toBeTrue();

    harness.fixture.destroy();

    expect(positions.observed).withContext('You need to unsubscribe from raceService.live when the component is destroyed').toBeFalse();
  });

  it('should display the pending race', async () => {
    raceService.get.and.returnValue(
      of({
        ...race,
        ponies: [
          { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
          { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
          { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
        ]
      })
    );
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    const title = element.querySelector('h1')!;
    expect(title).withContext('The template should display an h1 element with the race name inside').not.toBeNull();
    expect(title.textContent).withContext('The template should display an h1 element with the race name inside').toContain('Lyon');
    const liveRace = element.querySelector('#live-race')!;
    expect(liveRace.textContent).toContain('The race will start');

    const debugElement = harness.routeDebugElement!;
    const ponyComponents = debugElement.queryAll(By.directive(PonyStubComponent));
    expect(ponyComponents).withContext('You should display a `PonyComponent` for each pony').not.toBeNull();
    expect(ponyComponents.length).withContext('You should display a `PonyComponent` for each pony').toBe(3);

    const sunnySunday = ponyComponents[0].componentInstance as PonyStubComponent;
    expect(sunnySunday.isRunning()).withContext('The ponies should not be running').toBeFalsy();
  });

  it('should display the running race', async () => {
    raceService.get.and.returnValue(
      of({
        ...race,
        status: 'RUNNING',
        ponies: [
          { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
          { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
          { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
        ]
      })
    );
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    const title = element.querySelector('h1')!;
    expect(title).withContext('The template should display an h1 element with the race name inside').not.toBeNull();
    expect(title.textContent).withContext('The template should display an h1 element with the race name inside').toContain('Lyon');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 10 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    harness.detectChanges();

    const debugElement = harness.routeDebugElement!;
    const ponyComponents = debugElement.queryAll(By.directive(PonyStubComponent));
    expect(ponyComponents).withContext('You should display a `PonyComponent` for each pony').not.toBeNull();
    expect(ponyComponents.length).withContext('You should display a `PonyComponent` for each pony').toBe(3);

    const sunnySunday = ponyComponents[0].componentInstance as PonyStubComponent;
    expect(sunnySunday.isRunning()).withContext('The ponies should be running').toBeTruthy();
  });

  it('should display the finished race', async () => {
    raceService.get.and.returnValue(
      of({
        ...race,
        ponies: [
          { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
          { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
          { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
        ],
        betPonyId: 1
      })
    );
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    const title = element.querySelector('h1')!;
    expect(title).withContext('The template should display an h1 element with the race name inside').not.toBeNull();
    expect(title.textContent).withContext('The template should display an h1 element with the race name inside').toContain('Lyon');

    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    positions.complete();
    harness.detectChanges();

    // won the bet!
    const debugElement = harness.routeDebugElement!;
    const ponyComponents = debugElement.queryAll(By.directive(PonyStubComponent));
    expect(ponyComponents).withContext('You should display a `PonyComponent` for each winner').not.toBeNull();
    expect(ponyComponents.length).withContext('You should display a `PonyComponent` for each pony').toBe(2);

    const sunnySunday = ponyComponents[0].componentInstance as PonyStubComponent;
    expect(sunnySunday.isRunning()).withContext('The ponies should be not running').toBeFalsy();

    expect(element.textContent).toContain('You won your bet!');
  });

  it('should display a message when the race is lost', async () => {
    raceService.get.and.returnValue(
      of({
        ...race,
        ponies: [
          { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
          { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
          { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
        ],
        betPonyId: 3
      })
    );
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    positions.next([
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101 },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100 },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9 }
    ]);
    positions.complete();
    harness.detectChanges();

    // lost the bet...
    expect(element.textContent).toContain('You lost your bet.');
  });

  it('should display a message when the race is over', async () => {
    raceService.get.and.returnValue(
      of({
        ...race,
        ponies: [
          { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
          { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
          { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
        ],
        status: 'FINISHED'
      })
    );

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    harness.detectChanges();

    // race is over
    expect(element.textContent).toContain('The race is over.');
  });

  it('should display a message when an error occurred', async () => {
    raceService.get.and.returnValue(
      of({
        ...race,
        ponies: [
          { id: 1, name: 'Sunny Sunday', color: 'BLUE' },
          { id: 2, name: 'Pinkie Pie', color: 'GREEN' },
          { id: 3, name: 'Awesome Fridge', color: 'YELLOW' }
        ],
        betPonyId: 1
      })
    );
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    const element = harness.routeNativeElement!;
    const title = element.querySelector('h1')!;
    expect(title).withContext('The template should display an h1 element with the race name inside').not.toBeNull();
    expect(title.textContent).withContext('The template should display an h1 element with the race name inside').toContain('Lyon');

    positions.error(new Error('oops'));
    harness.detectChanges();

    // an error occurred
    const alert = element.querySelector('div.alert.alert-danger')!;
    expect(alert.textContent).toContain('A problem occurred during the live.');
  });
});
