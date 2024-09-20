import { Inject, Injectable, Type } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../environments/environment';
import * as WebstompClient from 'webstomp-client';
import { WEBSOCKET, WEBSTOMP } from './app.tokens';

@Injectable({
  providedIn: 'root'
})
export class WsService {
  constructor(
    @Inject(WEBSOCKET) private WebSocket: Type<WebSocket>,
    @Inject(WEBSTOMP) private Webstomp: typeof WebstompClient
  ) {}

  public connect<T>(channel: string): Observable<T> {
    return new Observable((observer: Observer<T>) => {
      const connection: WebSocket = new this.WebSocket(`${environment.wsBaseUrl}/ws`);
      const stompClient: WebstompClient.Client = this.Webstomp.over(connection);

      let subscription: WebstompClient.Subscription;
      stompClient.connect(
        { login: '', passcode: '' },
        () => {
          subscription = stompClient.subscribe(channel, message => {
            const bodyAsJson = JSON.parse(message.body) as T;
            observer.next(bodyAsJson);
          });
        },
        error => observer.error(error)
      );

      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
        connection.close();
      };
    });
  }
}
