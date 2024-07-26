import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserModel } from './models/user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {}

  authenticate(login: string, password: string): Observable<UserModel> {
    const body = { login, password };
    return this.http.post<UserModel>('https://ponyracer.ninja-squad.com/api/users/authentication', body);
  }
}
