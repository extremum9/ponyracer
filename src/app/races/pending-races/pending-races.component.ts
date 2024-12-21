import { Component } from '@angular/core';
import { RaceModel } from '../../models/race.model';
import { RaceService } from '../../race.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RaceComponent } from '../../race/race.component';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@jsverse/transloco';

@Component({
  standalone: true,
  imports: [RouterLink, RaceComponent, TranslocoDirective],
  templateUrl: './pending-races.component.html',
  styleUrl: './pending-races.component.css'
})
export class PendingRacesComponent {
  public races: RaceModel[] = [];

  constructor(private _raceService: RaceService) {
    this._raceService
      .list('PENDING')
      .pipe(takeUntilDestroyed())
      .subscribe(races => (this.races = races));
  }
}
