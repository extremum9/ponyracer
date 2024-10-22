import { Component } from '@angular/core';
import { RaceModel } from '../models/race.model';
import { startWith, Subject, switchMap } from 'rxjs';
import { RaceService } from '../race.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FromNowPipe } from '../from-now.pipe';
import { PonyComponent } from '../pony/pony.component';
import { PonyModel } from '../models/pony.model';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'pr-bet',
  standalone: true,
  imports: [RouterLink, FromNowPipe, PonyComponent, NgbAlert],
  templateUrl: './bet.component.html',
  styleUrl: './bet.component.css'
})
export class BetComponent {
  public raceModel: RaceModel | null = null;
  public betFailed = false;
  private _refreshSubject = new Subject<void>();

  constructor(
    private _route: ActivatedRoute,
    private _raceService: RaceService
  ) {
    const raceId = parseInt(this._route.snapshot.paramMap.get('raceId')!);
    this._refreshSubject
      .pipe(
        startWith(undefined),
        switchMap(() => this._raceService.get(raceId)),
        takeUntilDestroyed()
      )
      .subscribe(race => (this.raceModel = race));
  }

  public betOnPony(pony: PonyModel): void {
    this.betFailed = false;
    const result$ = this.isPonySelected(pony)
      ? this._raceService.cancelBet(this.raceModel!.id)
      : this._raceService.bet(this.raceModel!.id, pony.id);
    result$.subscribe({
      next: () => this._refreshSubject.next(),
      error: () => (this.betFailed = true)
    });
  }

  public isPonySelected(pony: PonyModel): boolean {
    return pony.id === this.raceModel!.betPonyId;
  }
}
