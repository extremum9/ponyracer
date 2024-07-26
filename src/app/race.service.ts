import { Injectable } from '@angular/core';
import { RaceModel } from './models/race.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RaceService {
  constructor(private http: HttpClient) {}

  list(): Observable<RaceModel[]> {
    const params = { status: 'PENDING' };
    return this.http.get<RaceModel[]>('https://ponyracer.ninja-squad.com/api/races', { params });
  }
}
