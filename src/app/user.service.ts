import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiUrl = 'https://ponyracer.ninja-squad.com/api';
  public userEvents = new BehaviorSubject<UserModel | null>(null);

  constructor(private http: HttpClient) {}

  public authenticate(login: string, password: string): Observable<UserModel> {
    const body = { login, password };
    return this.http.post<UserModel>(`${this.apiUrl}/users/authentication`, body).pipe(tap(user => this.userEvents.next(user)));
  }

  public register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${this.apiUrl}/users`, body);
  }
}
