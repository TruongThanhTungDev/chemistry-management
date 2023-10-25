import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { DataService } from "../../utils/dataService";
import { NgxBarcodeScannerService } from "@eisberg-labs/ngx-barcode-scanner";

@Component({
  selector: 'barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class BarcodeScanner implements OnInit ,AfterViewInit {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  isLoading = false;
  devices: any;
  hasDevice = false
  type = 1
  constructor(
    private dataService: DataService,
    private barcodeScanner: NgxBarcodeScannerService
  ) {}
  value: any;
  isError: any;
  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream: any) => {
        this.hasDevice = true;
      })
      .catch(() => {
        this.hasDevice = false;
      });
  }
  onError(error: any) {
    console.error(error);
    this.isError = true;
  }
  getData(event: any) {
    if (event) {
      this.dataService.sendData(event);
      this.barcodeScanner.stop();
      this.#modal.destroy();
    }
  }
  closeModal() {
    this.#modal.destroy();
  }
}