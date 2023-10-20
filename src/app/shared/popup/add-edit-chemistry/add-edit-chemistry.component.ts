import { Component, Input, ViewChild, inject } from '@angular/core'
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { BasicInformationChemistry } from './basic-infomation-chemistry/basic-infomation-chemistry.component';
import { NotificationService } from '../../utils/toast.service';
import { ApiServices } from 'src/app/api.services';
import * as moment from 'moment';
import { OPERATIONS } from 'src/app/app.constants';
import { HttpResponse } from '@angular/common/http';
import { OtherInformationChemistry } from './other-information-chemistry/other-information-chemistry.component';

@Component({
  selector: 'add-edit-chemistry',
  templateUrl: './add-edit-chemistry.component.html',
  styleUrls: ['./add-edit-chemistry.component.scss'],
})
export class AddEditChemistryComponent {
  @ViewChild('basicInfo') basicInfo!: BasicInformationChemistry;
  @ViewChild('otherInfo') otherInfo!: OtherInformationChemistry

  @Input() title?: string;

  REQUEST_URL = 'api/v1/Chemiscal';
  readonly #addModal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  isLoading = false;

  constructor(
    private notify: NotificationService,
    private service: ApiServices
  ) {}

  saveInformation() {
    return new Promise((resolve: any, reject: any) => {
      if (!this.basicInfo.validateForm()) {
        this.notify.warning('Cảnh báo', 'Vui lòng nhập đầy đủ các trường');
        return;
      }
      const payload = {
        ...this.basicInfo.basicInformation.value,
        expirationDate: parseInt(
          moment(this.basicInfo.basicInformation.value.expirationDate).format(
            'YYYYMMDD'
          )
        ),
        ...this.otherInfo.otherInfo
      };
      this.isLoading = true;
      this.service
        .postOption(this.REQUEST_URL, payload, OPERATIONS.CREATE)
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.isLoading = false;
              this.notify.success(
                'Thông báo',
                'Thêm mới chất hóa học thành công'
              );
              resolve(res);
            } else {
              this.isLoading = false;
              this.notify.error('Lỗi', res.body.MESSAGE);
              reject(res);
            }
          },
          (err) => {
            reject(err);
            this.isLoading = false;
            console.error();
            this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
          }
        );
    });
  }
}