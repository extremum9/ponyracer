import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RaceModel } from '../models/race.model';
import { PonyComponent } from '../pony/pony.component';
import { RaceComponent } from './race.component';

@Component({
  standalone: true,
  imports: [RaceComponent],
  template: '<pr-race [raceModel]="race()" />'
})
export class RaceTestComponent {
  race = signal<RaceModel>({
    id: 12,
    name: 'Paris',
    ponies: [
      { id: 1, name: 'Gentle Pie', color: 'YELLOW' },
      { id: 2, name: 'Big Soda', color: 'ORANGE' },
      { id: 3, name: 'Gentle Bottle', color: 'PURPLE' },
      { id: 4, name: 'Superb Whiskey', color: 'GREEN' },
      { id: 5, name: 'Fast Rainbow', color: 'BLUE' }
    ],
    startInstant: '2024-02-18T08:02:00'
  });
}

describe('RaceComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should display a race name and its ponies', () => {
    const fixture = TestBed.createComponent(RaceTestComponent);
    fixture.detectChanges();

    // then we should have the name and ponies displayed in the template
    const element = fixture.nativeElement as HTMLElement;
    const raceName = element.querySelector('h2')!;
    expect(raceName).withContext('You need an h2 element for the race name').not.toBeNull();
    expect(raceName.textContent).withContext('The h2 element should contain the race name').toContain('Paris');
    const startInstant = element.querySelector('p')!;
    expect(startInstant).withContext('You need an p element for the race start instant').not.toBeNull();
    expect(startInstant.textContent).withContext('The p element should contain the race start instant').toContain('2/18/24, 8:02 AM');
    const ponies = fixture.debugElement.queryAll(By.directive(PonyComponent));
    expect(ponies).withContext('You should use the PonyComponent in your template to display the ponies').not.toBeNull();
    expect(ponies.length).withContext('You should have five pony components in your template').toBe(5);
  });
});
