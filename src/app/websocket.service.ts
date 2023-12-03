// web-socket.service.ts
import { Injectable } from '@angular/core';
import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService {
  private stompClient: any;

  connect(): Observable<any> {
    const socket = new SockJS('http://localhost:8080/ws');
    this.stompClient = Stomp.over(socket);
    return new Observable((observer) => {
      this.stompClient.connect(
        {},
        () => {
          observer.next(true);
        },
        (error:any) => {
          observer.error(error);
        }
      );
    });
  }

  disconnect(): void {
    if (this.stompClient) {
      this.stompClient.disconnect();
    }
  }

  subscribe(topic: string, callback: (message: any) => void): void {
    this.stompClient.subscribe(topic, (message:any) => {
      callback(JSON.parse(message.body));
    });
  }

  sendMessage(destination: string, message: string): void {
    this.stompClient.send(destination, {}, message);
  }
}
