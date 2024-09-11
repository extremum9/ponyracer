import { Injectable } from '@angular/core';
import { RaceModel } from './models/race.model';
import { interval, map, Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PonyWithPositionModel } from './models/pony.model';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  constructor(private _http: HttpClient) {}

  public list(): Observable<RaceModel[]> {
    const params = { status: 'PENDING' };
    return this._http.get<RaceModel[]>(`${environment.baseUrl}/api/races`, { params });
  }

  public get(id: number): Observable<RaceModel> {
    return this._http.get<RaceModel>(`${environment.baseUrl}/api/races/${id}`);
  }

  public bet(raceId: number, ponyId: number): Observable<void> {
    return this._http.post<void>(`${environment.baseUrl}/api/races/${raceId}/bets`, { ponyId });
  }

  public cancelBet(raceId: number): Observable<void> {
    return this._http.delete<void>(`${environment.baseUrl}/api/races/${raceId}/bets`);
  }

  public live(raceId: number): Observable<PonyWithPositionModel[]> {
    return interval(1000).pipe(
      take(101),
      map(position => [
        {
          id: 1,
          name: 'Superb Runner',
          color: 'BLUE',
          position
        },
        {
          id: 2,
          name: 'Awesome Fridge',
          color: 'GREEN',
          position
        },
        {
          id: 3,
          name: 'Great Bottle',
          color: 'ORANGE',
          position
        },
        {
          id: 4,
          name: 'Little Flower',
          color: 'YELLOW',
          position
        },
        {
          id: 5,
          name: 'Nice Rock',
          color: 'PURPLE',
          position
        }
      ])
    );
  }
}
