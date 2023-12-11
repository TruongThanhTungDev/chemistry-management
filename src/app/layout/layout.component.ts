import { Component, OnDestroy, OnInit } from "@angular/core";
import { env } from "../environment";

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  REQUEST_URL_SOCKET = 'ws';
  socket?: WebSocket;
  constructor(
  ) {}
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {}
}