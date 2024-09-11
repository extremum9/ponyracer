import { Component } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { RaceService } from '../race.service';
import { ActivatedRoute } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PonyWithPositionModel } from '../models/pony.model';
import { PonyComponent } from '../pony/pony.component';

@Component({
  selector: 'pr-live',
  standalone: true,
  imports: [PonyComponent],
  templateUrl: './live.component.html',
  styleUrl: './live.component.css'
})
export class LiveComponent {
  public raceModel: RaceModel | null = null;
  public poniesWithPosition: PonyWithPositionModel[] = [];

  constructor(
    private _raceService: RaceService,
    private _route: ActivatedRoute
  ) {
    const raceId = parseInt(this._route.snapshot.paramMap.get('raceId')!);
    this._raceService.get(raceId).subscribe(race => (this.raceModel = race));
    this._raceService
      .live(raceId)
      .pipe(takeUntilDestroyed())
      .subscribe(positions => (this.poniesWithPosition = positions));
  }
}
