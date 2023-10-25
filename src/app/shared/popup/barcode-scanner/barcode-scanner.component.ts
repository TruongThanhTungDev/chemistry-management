import { Component, EventEmitter, Input, Output, inject } from "@angular/core";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";
import { DataService } from "../../utils/dataService";
import { NgxBarcodeScannerService } from "@eisberg-labs/ngx-barcode-scanner";

@Component({
  selector: 'barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class BarcodeScanner {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  isLoading = false
  constructor(
    private dataService: DataService,
    private barcodeScanner: NgxBarcodeScannerService
  ) {

  }
  value: any;
  isError: any;
  onError(error: any) {
    console.error(error);
    this.isError = true;
  }
  getData(event: any) {
    if(event) {
      this.dataService.sendData(event)
      this.barcodeScanner.stop()
      this.#modal.destroy()
    }
  }
  closeModal() {
    this.#modal.destroy()
  }
}