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
import { NotificationService } from '../../utils/toast.service';

@Component({
  selector: 'barcode-scanner',
  templateUrl: './barcode-scanner.component.html',
  styleUrls: ['./barcode-scanner.component.scss'],
})
export class BarcodeScanner implements OnInit, AfterViewInit {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  isLoading = false;
  devices: any;
  hasDevice = false;
  type = 1;
  image: any;
  barcode: any
  constructor(
    private dataService: DataService,
    private barcodeScanner: NgxBarcodeScannerService,
    private notify: NotificationService
  ) {}
  value: any;
  isError: any;
  ngOnInit(): void {}
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
  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = this._handleReaderLoaded.bind(this);
      reader.readAsDataURL(file);
    }
  }
  _handleReaderLoaded(e: any) {
    const reader = e.target;
    Quagga.decodeSingle(
      {
        src: reader.result,
        numOfWorkers: 0,
        locate: true,
        decoder: {
          reader: ['code_128'],
        },
      },
      (result: any) => {
        console.log('result :>> ', result);
        if (result && result.codeResult) {
          this.barcode = parseInt(result.codeResult.code)
        } else {
          this.notify.error('Thông báo', 'Không tìm thấy mã trong ảnh');
        }
      }
    );
    this.image = reader.result;
  }
  closeModal() {
    this.#modal.destroy();
  }
  searchByImage() {
    this.dataService.sendData(this.barcode);
  }
}
declare let Quagga: any;