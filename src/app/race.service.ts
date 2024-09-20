import { Injectable } from '@angular/core';
import { LiveRaceModel, RaceModel } from './models/race.model';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { PonyWithPositionModel } from './models/pony.model';
import { WsService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  constructor(
    private _http: HttpClient,
    private _wsService: WsService
  ) {}

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
    return this._wsService.connect<LiveRaceModel>(`/race/${raceId}`).pipe(map(liveRace => liveRace.ponies));
  }
}
