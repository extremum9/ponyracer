import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RaceModel } from '../../models/race.model';
import { RaceService } from '../../race.service';
import { RaceComponent } from '../../race/race.component';
import { NgbPagination } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, map, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';

interface ViewModel {
  page: number;
  total: number;
  races: Array<RaceModel>;
}

@Component({
  standalone: true,
  imports: [AsyncPipe, RaceComponent, NgbPagination],
  templateUrl: './finished-races.component.html',
  styleUrl: './finished-races.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FinishedRacesComponent {
  public vm$: Observable<ViewModel>;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _raceService: RaceService
  ) {
    const allRaces$ = this._raceService.list('FINISHED');
    const page$ = this._route.queryParamMap.pipe(map(paramMap => parseInt(paramMap.get('page') ?? '1')));

    this.vm$ = combineLatest([allRaces$, page$]).pipe(
      map(([allRaces, page]) => ({
        total: allRaces.length,
        page,
        races: allRaces.slice((page - 1) * 10, page * 10)
      }))
    );
  }

  public changePage(page: number): void {
    this._router.navigate(['.'], { relativeTo: this._route, queryParams: { page } });
  }
}
