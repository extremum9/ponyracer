import { Component } from '@angular/core';
import { RaceModel } from '../../models/race.model';
import { RaceService } from '../../race.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RaceComponent } from '../../race/race.component';

@Component({
  standalone: true,
  imports: [RaceComponent],
  templateUrl: './finished-races.component.html',
  styleUrl: './finished-races.component.css'
})
export class FinishedRacesComponent {
  public races: RaceModel[] = [];

  constructor(private _raceService: RaceService) {
    this._raceService
      .list('FINISHED')
      .pipe(takeUntilDestroyed())
      .subscribe(races => (this.races = races));
  }
}
