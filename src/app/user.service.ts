import { effect, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';
import { WsService } from './ws.service';
import { MoneyHistoryModel } from './models/money-history.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user = signal<UserModel | null>(null);
  public readonly currentUser = this._user.asReadonly();

  constructor(
    private _http: HttpClient,
    private _wsService: WsService
  ) {
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
    return this._http.post<UserModel>(`${environment.baseUrl}/api/users`, body);
  }

  public authenticate(login: string, password: string): Observable<UserModel> {
    const body = { login, password };
    return this._http.post<UserModel>(`${environment.baseUrl}/api/users/authentication`, body).pipe(tap(user => this._user.set(user)));
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

  public scoreUpdates(userId: number): Observable<UserModel> {
    return this._wsService.connect<UserModel>(`/player/${userId}`);
  }

  public getMoneyHistory(): Observable<Array<MoneyHistoryModel>> {
    return this._http.get<Array<MoneyHistoryModel>>(`${environment.baseUrl}/api/money/history`);
  }
}
