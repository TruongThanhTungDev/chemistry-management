import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiServices } from 'src/app/api.services';
import { NotificationService } from 'src/app/shared/utils/toast.service';
import { HttpResponse } from '@angular/common/http';
import { RegisterSchedulePopup } from 'src/app/shared/popup/register-schedule-popup/register-schedule-popup.component';
@Component({
  selector: 'practice-register',
  templateUrl: './register-schedule.component.html',
  styleUrls: ['register-schedule.component.scss'],
})
export class RegisterSchedule implements OnInit {
  constructor(
    private service: ApiServices,
    private notify: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any)
  }
  REQUEST_URL = 'api/v1/practiceScheldule';
  isLoading = false;
  date: any[] = [
    this.getStartOfWeek(new Date()),
    this.getEndOfWeek(new Date()),
  ];
  listResgiter: any[] = [];
  rowSelected: any;
  infoUser: any
  page = 1;
  totalItems = 0;
  size = 10;
  ngOnInit() {
    this.getListRegisterSchedule();
  }

  getListRegisterSchedule() {
    const payload = {
      page: this.page - 1,
      size: this.size,
      filter: this.filterData(),
      sort: ['id', 'desc'],
    };
    this.isLoading = true;
    this.service.getOption(this.REQUEST_URL, payload, '/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.isLoading = false
          this.listResgiter = res.body.RESULT.content
          this.totalItems = res.body.RESULT.totalElements;
        } else {
          this.isLoading = false
          this.notify.error('Lỗi', res.body.MESSAGE)
        }
      },
      () => {
        console.error()
        this.isLoading = false
        this.notify.error('Lỗi', 'Có lỗi khi lấy danh sách đăng ký thực hành!')
      }
    )
  }
  filterData() {
    const filter = [];
    filter.push('id>0');
    const startDate = parseInt(moment(this.date[0]).format('YYYYMMDD000000'));
    const endDate = parseInt(moment(this.date[1]).format('YYYYMMDD235959'));
    return filter.join(';');
  }
  selectRow(item: any) {}
  changePage(event: any) {
    this.page = event;
    this.getListRegisterSchedule()
  }
  getStartOfWeek(d: any) {
    d = new Date(d);
    let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }
  getEndOfWeek(d: any) {
    d = new Date(d);
    let day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? 0 : 7);
    return new Date(d.setDate(diff));
  }
  openRegisterPopup() {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Đăng ký thực hành',
      nzContent: RegisterSchedulePopup,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '1100px',
      nzBodyStyle: {
        height: '570px',
      },
      nzCentered: true,
      nzData: {
        favoriteLibrary: 'angular',
        favoriteFramework: 'angular',
      },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modalRef.destroy(),
        },
        {
          label: 'Lưu',
          type: 'primary',
          onClick: async () => {
            
          },
        },
      ],
    });
  }
}