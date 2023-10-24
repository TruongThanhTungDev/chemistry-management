import { AfterViewInit, Component, Input, OnInit, ViewChild, inject } from '@angular/core'
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
export class AddEditChemistryComponent implements OnInit, AfterViewInit {
  @ViewChild('basicInfo', {static: false}) basicInfo!: BasicInformationChemistry;
  @ViewChild('otherInfo', {static: false}) otherInfo!: OtherInformationChemistry;

  @Input() title?: string;
  @Input() isEdit?: boolean = false;
  @Input() data?: any;

  REQUEST_URL = 'api/v1/Chemiscal';
  readonly #addModal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  isLoading = false;

  constructor(
    private notify: NotificationService,
    private service: ApiServices
  ) {}

  ngOnInit() {
      
  }
  ngAfterViewInit() {
    if (this.isEdit) {
      this.basicInfo.basicInformation.patchValue({
        code: this.data.code,
        name: this.data.name,
        chemiscalType: this.data.chemiscalType,
        quantity: this.data.quantity,
        nomenclature: this.data.nomenclature,
        formula: this.data.formula,
        image: this.data.image,
        storageStatus: this.data.storageStatus,
        usingStatus: this.data.usingStatus,
        expirationDate: new Date()
      });
      this.otherInfo.otherInfo.bondStructure = this.data.bondStructure
      this.otherInfo.otherInfo.chemicalProperties = this.data.chemicalProperties
      this.otherInfo.otherInfo.numberOfMoles = this.data.numberOfMoles
      this.otherInfo.otherInfo.physicalProperties = this.data.physicalProperties
      this.otherInfo.otherInfo.naturalStatus = this.data.naturalStatus
    }
  }
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
        quantity: parseInt(this.basicInfo.basicInformation.value.quantity),
        ...this.otherInfo.otherInfo,
        numberOfMoles: parseFloat(this.otherInfo.otherInfo.numberOfMoles),
      };
      this.isLoading = true;
      if (!this.isEdit) {
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
      } else {
        payload.id = this.data.id 
        this.service
          .put(this.REQUEST_URL, payload, OPERATIONS.UPDATE)
          .subscribe(
            (res: HttpResponse<any>) => {
              if (res.body.CODE === 200) {
                this.isLoading = false;
                this.notify.success(
                  'Thông báo',
                  'Cập nhật chất hóa học thành công'
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
      }
    });
  }
}