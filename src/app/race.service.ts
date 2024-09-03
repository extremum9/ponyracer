import { Injectable } from '@angular/core';
import { RaceModel } from './models/race.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

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
}
