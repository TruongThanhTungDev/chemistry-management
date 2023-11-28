import { Component, OnDestroy, OnInit } from "@angular/core";
import { env } from "../environment";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  REQUEST_URL_SOCKET = 'ws';
  private readonly baseUrl: string = 'ws://localhost:8080/chat';
  socket?: WebSocket;
  ngOnInit(): void {
    this.socket = new WebSocket(this.baseUrl);

    this.socket.onopen = (event) => {
      console.log('open :>> ', event);
    };

    this.socket.onmessage = (event) => {
      console.log('mesage :>> ', event);
    };

    this.socket.onerror = (error) => {
      console.log('error :>> ', error);
    };
  }
  ngOnDestroy(): void {}
}