import { Component, Input, inject } from '@angular/core';
import * as moment from 'moment';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import readXlsxFile from 'read-excel-file';
import { ApiServices } from 'src/app/api.services';
import { NotificationService } from '../../utils/toast.service';

@Component({
  selector: 'add-multiple-chemistry-by-file',
  templateUrl: './add-multiple-chemistry-by-file.component.html',
  styleUrls: ['add-multiple-chemistry-by-file.component.scss'],
})
export class AddMultipleChemistryByFile {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  UPLOAD_FILE_URL = 'api/v1/Chemiscal/uploadChemiscal';
  listChemistry: any[] = [];
  selectedFile: any;
  isLoading = false;

  constructor(
    private service: ApiServices,
    private notify: NotificationService
  ) {}

  selectFile(event: any) {
    this.selectedFile = event.target.files[0];
    readXlsxFile(this.selectedFile).then((result: any) => {
      this.listChemistry = result.slice(1).map((item: any) => ({
        chemiscalType: item[0],
        name: item[1],
        nomenclature: item[2],
        formula: item[3],
        quantity: item[4] + item[9],
        expirationDate: item[5],
      }));
    });
  }
  formatDate(date: any) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '';
  }
  saveUploadFile() {
    return new Promise((resolve: any, reject: any) => {
      const formData = new FormData();
      formData.append('file', this.selectedFile);
      this.isLoading = true;
      this.service.uploadFile(this.UPLOAD_FILE_URL, formData).subscribe(
        (res: any) => {
          if (res.body.CODE === 200) {
            this.isLoading = false;
            this.notify.success('Thông báo', 'Nhập dữ liệu thành công');
            this.#modal.close();
            this.listChemistry = []
            this.selectedFile = null
            resolve(res);
          } else {
            this.isLoading = false;
            this.notify.error('Lỗi', res.body.MESSAGE);
            resolve(res);
          }
        },
        (err) => {
          reject(err);
          this.isLoading = false;
          this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        }
      );
    });
  }
}
