import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { RouterTestingHarness } from '@angular/router/testing';
import { provideRouter, Router } from '@angular/router';
import { RaceModel } from '../../models/race.model';
import { RaceComponent } from '../../race/race.component';
import { RaceService } from '../../race.service';
import { FinishedRacesComponent } from './finished-races.component';

@Component({
  selector: 'pr-race',
  template: '<h2>{{ raceModel().name }}</h2>',
  standalone: true
})
class RaceStubComponent {
  raceModel = input.required<RaceModel>();
}

describe('FinishedRacesComponent', () => {
  let raceService: jasmine.SpyObj<RaceService>;

  beforeEach(() => {
    raceService = jasmine.createSpyObj<RaceService>('RaceService', ['list']);
    TestBed.overrideComponent(FinishedRacesComponent, {
      remove: {
        imports: [RaceComponent]
      },
      add: {
        imports: [RaceStubComponent]
      }
    });
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'races/finished', component: FinishedRacesComponent }]),
        { provide: RaceService, useValue: raceService }
      ]
    });
    raceService.list.and.returnValue(
      of([
        { id: 1, name: 'Lyon', startInstant: '2024-02-18T08:02:00Z' },
        { id: 2, name: 'Los Angeles', startInstant: '2024-02-18T08:03:00Z' },
        { id: 3, name: 'Sydney', startInstant: '2024-02-18T08:04:00Z' },
        { id: 4, name: 'Tokyo', startInstant: '2024-02-18T08:05:00Z' },
        { id: 5, name: 'Casablanca', startInstant: '2024-02-18T08:06:00Z' },
        { id: 6, name: 'Paris', startInstant: '2024-02-18T08:07:00Z' },
        { id: 7, name: 'London', startInstant: '2024-02-18T08:08:00Z' },
        { id: 8, name: 'Madrid', startInstant: '2024-02-18T08:09:00Z' },
        { id: 9, name: 'Lima', startInstant: '2024-02-18T08:10:00Z' },
        { id: 10, name: 'Bali', startInstant: '2024-02-18T08:11:00Z' },
        { id: 11, name: 'Berlin', startInstant: '2024-02-18T08:12:00Z' },
        { id: 12, name: 'Kyiv', startInstant: '2024-02-18T08:13:00Z' }
      ] as RaceModel[])
    );
  });

  it('should display the first page of races by default', async () => {
    const harness = await RouterTestingHarness.create('/races/finished');
    const debugElement = harness.routeDebugElement!;
    const element = harness.routeNativeElement!;

    const raceNames = debugElement.queryAll(By.directive(RaceStubComponent));
    expect(raceNames.length).withContext('You should have 10 `RaceComponent` displayed').toBe(10);
    expect((raceNames[0].componentInstance as RaceStubComponent).raceModel().name)
      .withContext('You should display the first page races')
      .toBe('Lyon');

    const pagination = debugElement.query(By.directive(NgbPagination));
    expect(pagination).withContext('You should have a pagination').not.toBeNull();

    const pageLinks = element.querySelectorAll('a.page-link');
    expect(pageLinks.length).withContext('You should have 2 pages, as the test uses 12 races').toBe(4);

    const activePageLink = element.querySelector<HTMLAnchorElement>('.page-item.active a')!;
    expect(activePageLink.textContent!.trim()).withContext('The active page link should be 1').toBe('1');
  });

  it('should display the second page of races if page query param is 2', async () => {
    const harness = await RouterTestingHarness.create('/races/finished?page=2');
    const debugElement = harness.routeDebugElement!;
    const element = harness.routeNativeElement!;

    const raceNames = debugElement.queryAll(By.directive(RaceStubComponent));
    expect(raceNames.length).withContext('You should have 2 `RaceComponent` displayed on the 2nd page, as the test uses 12 races').toBe(2);
    expect((raceNames[0].componentInstance as RaceStubComponent).raceModel().name)
      .withContext('You should display the second page races')
      .toBe('Berlin');

    const activePageLink = element.querySelector<HTMLAnchorElement>('.page-item.active a')!;
    expect(activePageLink.textContent!.trim()).withContext('The active page link should be 2').toBe('2');
  });

  it('should navigate to the second page of races when clicking the button', async () => {
    const harness = await RouterTestingHarness.create('/races/finished');
    const debugElement = harness.routeDebugElement!;
    const element = harness.routeNativeElement!;

    const pageLinks = element.querySelectorAll('a.page-link');

    // click on link to page 2
    expect(pageLinks[2].textContent!.trim()).toBe('2');
    pageLinks[2].dispatchEvent(new Event('click'));
    await harness.fixture.whenStable();
    harness.detectChanges();

    const router = TestBed.inject(Router);
    expect(router.parseUrl(router.url).queryParams['page']).toBe('2');

    const raceNames = debugElement.queryAll(By.directive(RaceStubComponent));
    expect(raceNames.length).withContext('You should have 2 `RaceComponent` displayed on the 2nd page, as the test uses 12 races').toBe(2);
    expect((raceNames[0].componentInstance as RaceStubComponent).raceModel().name)
      .withContext('You should display the second page races')
      .toBe('Berlin');

    const activePageLink = element.querySelector<HTMLAnchorElement>('.page-item.active a')!;
    expect(activePageLink.textContent!.trim()).withContext('The active page link should be 2').toBe('2');
  });

  it('should not display a link to bet on a race', async () => {
    const harness = await RouterTestingHarness.create('/races/finished');
    const element = harness.routeNativeElement!;

    const raceNames = element.querySelectorAll('a:not(.page-link)');
    expect(raceNames.length).withContext('You must NOT have a link to go to the bet page for each race').toBe(0);
  });
});
