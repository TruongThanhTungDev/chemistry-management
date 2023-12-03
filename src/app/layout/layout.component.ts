import { Component, OnDestroy, OnInit } from "@angular/core";
import { env } from "../environment";
import { RxStompService } from "../rx-stomp.service";
import { WebSocketService } from "../websocket.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  REQUEST_URL_SOCKET = 'ws';
  socket?: WebSocket;
  constructor(
    private websocket: WebSocketService
  ) {}
  ngOnInit(): void {
    this.websocket.connect().subscribe(
      () => console.log('Connected'),
      (error:any) => console.error(error)
    );
  }
  ngOnDestroy(): void {}
}