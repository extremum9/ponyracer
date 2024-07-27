import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  apiUrl = 'https://ponyracer.ninja-squad.com/api';

  constructor(private http: HttpClient) {}

  authenticate(login: string, password: string): Observable<UserModel> {
    const body = { login, password };
    return this.http.post<UserModel>(`${this.apiUrl}/users/authentication`, body);
  }

  register(login: string, password: string, birthYear: number): Observable<UserModel> {
    const body = { login, password, birthYear };
    return this.http.post<UserModel>(`${this.apiUrl}/users`, body);
  }
}
