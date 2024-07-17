import { Component } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { RaceComponent } from '../race/race.component';
import { RaceService } from '../race.service';

@Component({
  selector: 'pr-races',
  standalone: true,
  imports: [RacesComponent, RaceComponent],
  templateUrl: './races.component.html',
  styleUrl: './races.component.css'
})
export class RacesComponent {
  public races: RaceModel[] = [];

  constructor(private _raceService: RaceService) {
    this._raceService.list().subscribe(races => (this.races = races));
  }
}
