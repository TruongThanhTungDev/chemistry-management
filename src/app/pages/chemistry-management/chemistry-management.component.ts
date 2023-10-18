import { HttpResponse } from '@angular/common/http';
import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { ApiServices } from 'src/app/api.services';
import { AddEditChemistryComponent } from 'src/app/shared/popup/add-edit-chemistry/add-edit-chemistry.component';
import { NotificationService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'chemistry-management',
  templateUrl: './chemistry-management.component.html',
  styleUrls: ['./chemistry-management.component.scss'],
})
export class ChemistryManagement implements OnInit {
  REQUEST_URL = 'api/v1/Chemiscal';
  listChemistry: any[] = [];
  isLoading = false;
  page = 1;
  itemPerPage = 10;
  totalItems = 0;
  constructor(
    private service: ApiServices,
    private notify: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.getDataChemistry()
  }
  getDataChemistry() {
    const payload = {
      page: this.page,
      size: this.itemPerPage,
      filter: this.filterData(),
      sort: ['id', 'desc'],
    };
    this.isLoading = true;
    this.service
      .getOption(this.REQUEST_URL, payload, '/search')
      .subscribe((res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.isLoading = false;
          // this.listChemistry = res.body.RESULT.content;
        } else {
          this.isLoading = false
          this.notify.error('Lỗi', 'Lấy danh sách thất bại')
        }
      },
        () => {
          this.isLoading = false;
          console.error()
          this.notify.error('Lỗi', 'Lấy danh sách thất bại');
      }
    );
  }
  filterData() {
    const filter = [];
    filter.push('id>0');
    return filter.join(';');
  }
  openAddChemistryModal() {
    this.modal.create({
      nzTitle: 'Thêm mới chất hóa học',
      nzContent: AddEditChemistryComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '1100px',
      nzBodyStyle: {
        height: '570px',
        overflowY: 'auto'
      },
      nzCentered: true,
      nzData: {
        favoriteLibrary: 'angular',
        favoriteFramework: 'angular'
      },
      nzOkText: 'Lưu',
      nzCancelText: 'Hủy',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.page = 1
        this.getDataChemistry()
      }
    })
  }
}
