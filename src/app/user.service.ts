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

  constructor(private _http: HttpClient) {
    this.retrieveUser();
  }

  public register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this._http.post<UserModel>(`${this.apiUrl}/users`, body);
  }

  public authenticate(login: string, password: string): Observable<UserModel> {
    const body = { login, password };
    return this._http.post<UserModel>(`${this.apiUrl}/users/authentication`, body).pipe(tap(user => this.storeLoggedInUser(user)));
  }

  public retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this.userEvents.next(user);
    }
  }

  private storeLoggedInUser(user: UserModel): void {
    this.userEvents.next(user);
    window.localStorage.setItem('rememberMe', JSON.stringify(user));
  }
}
