import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ApiServices } from 'src/app/api.services';
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
    private notify: NotificationService
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
}
