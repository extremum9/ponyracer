import { Component, input } from '@angular/core';
import { discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { NgbAlert, NgbAlertConfig } from '@ng-bootstrap/ng-bootstrap';
import { EMPTY, of, Subject } from 'rxjs';
import { provideI18nTesting } from '../../i18n-test';
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
  isBoosted = input(false);
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
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['get', 'live', 'boost']);
    TestBed.configureTestingModule({
      providers: [
        provideI18nTesting(),
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
    // turn off the animation for the alert
    const alertConfig = TestBed.inject(NgbAlertConfig);
    alertConfig.animation = false;
  });

  it('should change the race status once the race is RUNNING', async () => {
    raceService.get.and.returnValue(of({ ...race }));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/races/12/live', LiveComponent);

    // there is no flag displayed as the race is PENDING
    expect(harness.routeNativeElement!.querySelector('.fa-flag')).toBeNull();

    positions.next([{ id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 0, boosted: false }]);
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
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10, boosted: false },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 10, boosted: false },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9, boosted: false }
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
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101, boosted: false },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100, boosted: false },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9, boosted: false }
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
      { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101, boosted: false },
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100, boosted: false },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9, boosted: false }
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
    const debugElement = harness.routeDebugElement!;
    const alert = debugElement.query(By.directive(NgbAlert));
    expect(alert).withContext('You should have an NgbAlert to display the error').not.toBeNull();
    expect((alert.nativeElement as HTMLElement).textContent).toContain('A problem occurred during the live.');
    const alertComponent = alert.componentInstance as NgbAlert;
    expect(alertComponent.type).withContext('The alert should be a danger one').toBe('danger');
  });

  it('should emit an event with the pony when a pony is clicked', async () => {
    raceService.get.and.returnValue(of({ ...race }));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);
    const harness = await RouterTestingHarness.create();
    const liveComponent = await harness.navigateByUrl('/races/12/live', LiveComponent);
    spyOn(liveComponent.clickSubject, 'next');

    const pony: PonyWithPositionModel = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 101, boosted: false };
    positions.next([
      pony,
      { id: 2, name: 'Pinkie Pie', color: 'GREEN', position: 100, boosted: false },
      { id: 3, name: 'Awesome Fridge', color: 'YELLOW', position: 9, boosted: false }
    ]);
    harness.detectChanges();

    // when clicking on the first pony
    const ponyComponent = harness.routeDebugElement!.query(By.directive(PonyStubComponent));
    expect(ponyComponent).withContext('You should display a `PonyComponent` for each pony').not.toBeNull();
    ponyComponent.triggerEventHandler('ponyClicked', {});

    // then we should emit the pony on the subject
    expect(liveComponent.clickSubject.next).toHaveBeenCalledWith(pony);
  });

  it('should buffer clicks over a second and call the boost method', fakeAsync(async () => {
    raceService.get.and.returnValue(of({ ...race, status: 'RUNNING' }));
    raceService.boost.and.returnValue(of(undefined));
    const positions = new Subject<Array<PonyWithPositionModel>>();
    raceService.live.and.returnValue(positions);

    const harness = await RouterTestingHarness.create();
    const liveComponent = await harness.navigateByUrl('/races/12/live', LiveComponent);
    tick();

    const pony: PonyWithPositionModel = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10, boosted: false };

    // when 5 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should call the boost method
    expect(raceService.boost).toHaveBeenCalledWith(race.id, pony.id);
    raceService.boost.calls.reset();

    // when 5 clicks are emitted over 2 seconds
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should not call the boost method
    expect(raceService.boost).not.toHaveBeenCalled();
  }));

  it('should filter click buffer that are not at least 5', fakeAsync(async () => {
    raceService.get.and.returnValue(of({ ...race, status: 'RUNNING' }));
    raceService.boost.and.returnValue(of(undefined));
    raceService.live.and.returnValue(EMPTY);

    const harness = await RouterTestingHarness.create();
    const liveComponent = await harness.navigateByUrl('/races/12/live', LiveComponent);
    tick();

    const pony: PonyWithPositionModel = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10, boosted: false };
    const pony2: PonyWithPositionModel = { id: 2, name: 'Black Friday', color: 'GREEN', position: 11, boosted: false };

    // when 4 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should not call the boost method
    expect(raceService.boost).not.toHaveBeenCalled();

    // when 5 clicks are emitted over a second on two ponies
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony2);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony2);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should not call the boost method
    expect(raceService.boost).not.toHaveBeenCalled();
  }));

  it('should throttle repeated boosts', fakeAsync(async () => {
    raceService.get.and.returnValue(of({ ...race, status: 'RUNNING' }));
    raceService.boost.and.returnValue(of(undefined));
    raceService.live.and.returnValue(EMPTY);

    const harness = await RouterTestingHarness.create();
    const liveComponent = await harness.navigateByUrl('/races/12/live', LiveComponent);
    tick();

    const pony: PonyWithPositionModel = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10, boosted: false };

    // when 5 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(800);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(200);

    // then we should call the boost method
    expect(raceService.boost).toHaveBeenCalled();
    raceService.boost.calls.reset();

    // when 2 other clicks are emitted
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(800);

    // then we should not call the boost method with the throttling
    expect(raceService.boost).not.toHaveBeenCalled();

    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(200);

    // we should call it a bit later
    expect(raceService.boost).toHaveBeenCalled();
    discardPeriodicTasks();
  }));

  it('should catch a boost error', fakeAsync(async () => {
    raceService.get.and.returnValue(of({ ...race, status: 'RUNNING' }));
    const boost = new Subject<void>();
    raceService.boost.and.returnValue(boost);
    raceService.live.and.returnValue(EMPTY);

    const harness = await RouterTestingHarness.create();
    const liveComponent = await harness.navigateByUrl('/races/12/live', LiveComponent);
    tick();

    const pony: PonyWithPositionModel = { id: 1, name: 'Sunny Sunday', color: 'BLUE', position: 10, boosted: false };

    // when 5 clicks are emitted in a second
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // then we should call the boost method
    expect(raceService.boost).toHaveBeenCalled();
    raceService.boost.calls.reset();
    boost.error('You should catch a potential error from the boost method with a `catch` operator');

    // when 5 other clicks are emitted
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    liveComponent.clickSubject.next(pony);
    tick(1000);

    // we should call it again if the previous error has been handled
    expect(raceService.boost).toHaveBeenCalled();
    discardPeriodicTasks();
  }));
});
