import { Component, OnDestroy, OnInit } from "@angular/core";
import { env } from "../environment";
import { RxStompService } from "../rx-stomp.service";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  REQUEST_URL_SOCKET = 'ws';
  socket?: WebSocket;
  constructor(private rxStompService: RxStompService) {}
  ngOnInit(): void {
    // this.rxStompService.activate()
  }
  ngOnDestroy(): void {}
}