import { HttpResponse } from '@angular/common/http';
import { Component, Input, OnInit, inject } from '@angular/core';
import * as moment from 'moment';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { ApiServices } from 'src/app/api.services';
import { NotificationService } from '../../utils/toast.service';

@Component({
  selector: 'add-multiple-chemistry',
  templateUrl: './add-multiple-chemistry.component.html',
  styleUrls: ['./add-multiple-chemistry.component.scss'],
})
export class AddMultipleChemistryModal implements OnInit {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  REQUEST_URL = 'api/v1/Chemiscal';
  listChemistry: any[] = [];
  listChecked: any[] = []
  checked = false;
  indeterminate = false
  isLoading = false;
  constructor(
    private service: ApiServices,
    private notify: NotificationService
  ) {}
  ngOnInit(): void {
    this.getDataChemistry();
  }
  getDataChemistry() {
    const payload = {
      page: 0,
      size: 9999,
      filter: this.filterData(),
      sort: ['id', 'desc'],
    };
    this.isLoading = true;
    this.service.getOption(this.REQUEST_URL, payload, '/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.isLoading = false;
          this.listChemistry = res.body.RESULT.content;
        } else {
          this.isLoading = false;
          this.notify.error('Lỗi', 'Lấy danh sách thất bại');
        }
      },
      () => {
        this.isLoading = false;
        console.error();
        this.notify.error('Lỗi', 'Lấy danh sách thất bại');
      }
    );
  }
  filterData() {
    const filter = [];
    filter.push('id>0');
    filter.push(`isAdded=='false'`);
    filter.push('orderStatus==1');
    return filter.join(';');
  }
  formatDate(date: any) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '';
  }
  selectRow(item: any) {
    const index = this.listChecked.findIndex((el: any) => item.id === el.id)
    if (index !== -1) {
      this.listChecked.splice(index,1)
    } else {
      this.listChecked.push(item)
    }
  }
  selectAll() {
    if (this.listChecked && this.listChecked.length === this.listChemistry.length) {
      this.listChecked = [] as any
    } else {
      this.listChecked = [...this.listChemistry];
    }
  }
  addMultipleChemistry() {
    return new Promise((resolve: any, reject: any) => {
      if (!this.listChecked.length) {
        this.notify.warning(
          'Cảnh báo',
          'Vui lòng chọn ít nhất một chất hóa học'
        );
        return;
      }
      const payload = this.listChecked.map((item: any)=> ({
        ...item,
        orderStatus:1
       }))
      this.isLoading = true;
      this.service
        .postOption(this.REQUEST_URL, payload, '/createMultiChemiscal')
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.isLoading = false;
              this.notify.success(
                'Thông báo',
                'Thêm nhiều chất hóa học thành công!'
              );
              resolve(res);
              this.#modal.close();
            } else {
              resolve(res);
              this.isLoading = false;
              this.notify.error('Lỗi', res.body.MESSAGE);
            }
          },
          () => {
            reject();
            console.error();
            this.isLoading = false;
            this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
          }
        );
    })
  }
}
