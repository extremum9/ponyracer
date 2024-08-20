import { effect, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public apiUrl = 'https://ponyracer.ninja-squad.com/api';
  private _user = signal<UserModel | null>(null);
  public readonly currentUser = this._user.asReadonly();

  constructor(private _http: HttpClient) {
    this.retrieveUser();
    effect(() => {
      if (this._user()) {
        window.localStorage.setItem('rememberMe', JSON.stringify(this._user()));
      } else {
        window.localStorage.removeItem('rememberMe');
      }
    });
  }

  public register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this._http.post<UserModel>(`${this.apiUrl}/users`, body);
  }

  public authenticate(login: string, password: string): Observable<UserModel> {
    const body = { login, password };
    return this._http.post<UserModel>(`${this.apiUrl}/users/authentication`, body).pipe(tap(user => this._user.set(user)));
  }

  public retrieveUser(): void {
    const value = window.localStorage.getItem('rememberMe');
    if (value) {
      const user = JSON.parse(value) as UserModel;
      this._user.set(user);
    }
  }

  public logout(): void {
    this._user.set(null);
  }
}
