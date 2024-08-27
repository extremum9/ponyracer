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
}
