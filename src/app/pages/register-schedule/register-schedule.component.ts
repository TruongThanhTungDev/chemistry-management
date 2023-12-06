import { Component, OnInit, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiServices } from 'src/app/api.services';
import { NotificationService } from 'src/app/shared/utils/toast.service';
import { HttpResponse } from '@angular/common/http';
import { RegisterSchedulePopup } from 'src/app/shared/popup/register-schedule-popup/register-schedule-popup.component';
import { RejectRegisterSchedule } from 'src/app/shared/popup/reject-register-schedule/reject-register-schedule.component';
import { Store } from '@ngrx/store';
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
    private viewContainerRef: ViewContainerRef,
    private store: Store<any>
  ) {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }
  REQUEST_URL = 'api/v1/practiceScheldule';
  isLoading = false;
  date: any[] = [
    this.getStartOfWeek(new Date()),
    this.getEndOfWeek(new Date()),
  ];
  listResgiter: any[] = [];
  rowSelected: any;
  infoUser: any;
  page = 1;
  totalItems = 0;
  size = 10;
  ngOnInit() {
    this.getListRegisterSchedule();
    this.store.subscribe((state) => { 
      if (state.common.isViewSchedule) {
        this.getScheduleItem(state.common.practiceScheduleId);
      }
    })
  }
  get isAdmin() {
    return this.infoUser && this.infoUser.role === 'admin';
  }
  getScheduleItem(id: any) {
    this.getAllSchedule(id)
  }
  getAllSchedule(id: any) {
    console.log('id :>> ', id);
    this.service.get(this.REQUEST_URL + '/getAll').subscribe(
      (res: HttpResponse<any>) => {
        const schedule = res.body.RESULT.find((item: any) => item.id === id)
        if (schedule) {
          this.openEditRegisterSchedule(schedule)
          this.store.dispatch({
            type: 'SET_IS_VIEW_SCHEDULE',
            state: null,
            isViewSchedule: false,
          });
        } else {
          this.notify.error(
            'Lỗi',
            'Không tìm thấy lịch đăng ký tương ứng'
          );
        }
      }
    )
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
          this.isLoading = false;
          this.listResgiter = res.body.RESULT.content;
          this.totalItems = res.body.RESULT.totalElements;
        } else {
          this.isLoading = false;
          this.notify.error('Lỗi', res.body.MESSAGE);
        }
      },
      () => {
        console.error();
        this.isLoading = false;
        this.notify.error('Lỗi', 'Có lỗi khi lấy danh sách đăng ký thực hành!');
      }
    );
  }
  filterData() {
    const filter = [];
    filter.push('id>0');
    const startDate = parseInt(moment(this.date[0]).format('YYYYMMDD'));
    const endDate = parseInt(moment(this.date[1]).format('YYYYMMDD'));
    filter.push(`datetime>=${startDate}`);
    filter.push(`datetime<=${endDate}`);
    return filter.join(';');
  }
  filterDate(event: any) {
    this.page = 1;
    this.getListRegisterSchedule();
  }
  selectRow(item: any) {
    if (this.rowSelected && this.rowSelected.id === item.id) {
      this.rowSelected = null;
    } else {
      this.rowSelected = item;
    }
  }
  changePage(event: any) {
    this.page = event;
    this.getListRegisterSchedule();
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
          autoLoading: false,
          onClick: async () => {
            const ref = modalRef.getContentComponent() as RegisterSchedulePopup;
            const res = (await ref.saveRegisterSchedule()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              this.page = 1;
              this.getListRegisterSchedule();
            }
          },
        },
      ],
    });
  }
  openEditRegisterSchedule(item: any) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: `${this.isAdmin ? 'Xem' : 'Sửa'} thông tin Đăng ký thực hành`,
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
      nzFooter: !this.isAdmin
        ? [
            {
              label: 'Hủy',
              onClick: () => modalRef.destroy(),
            },
            {
              label: 'Lưu',
              type: 'primary',
              autoLoading: false,
              onClick: async () => {
                const ref =
                  modalRef.getContentComponent() as RegisterSchedulePopup;
                const res =
                  (await ref.saveRegisterSchedule()) as HttpResponse<any>;
                if (res.body.CODE === 200) {
                  this.page = 1;
                  this.getListRegisterSchedule();
                }
              },
            },
          ]
        : [
            {
              label: 'Từ chối',
              danger: true,
              onClick: () => {
                const ref =
                  modalRef.getContentComponent() as RegisterSchedulePopup;
                this.rowSelected = ref.data;
                this.rejectRegisterSchedule();
              },
            },
            {
              label: 'Duyệt',
              type: 'primary',
              autoLoading: false,
              onClick: () => {
                const ref =
                  modalRef.getContentComponent() as RegisterSchedulePopup;
                this.rowSelected = ref.data;
                this.acceptRegisterSchedule();
              },
            },
          ],
    });
    modalRef.componentInstance.isEdit = true;
    modalRef.componentInstance.data = item;
  }
  acceptRegisterSchedule() {
    this.modal.create({
      nzTitle: 'Duyệt Đơn đăng ký thực hành',
      nzContent: '<div class="text-center">Duyệt lịch hóa học này?</div>',
      nzCentered: true,
      nzOkText: 'Duyệt',
      nzCancelText: 'Hủy',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.handleAccept(1);
      },
    });
  }
  handleAccept(status: any, rejectReason = '') {
    return new Promise((resolve: any, reject: any) => {
      const payload = {
        practiceSchelduleId: this.rowSelected.id,
        status,
        rejectReason,
      };
      this.isLoading = true;
      this.service
        .postOption(this.REQUEST_URL, payload, '/changeStatus')
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              this.isLoading = false;
              this.notify.success(
                'Thành công',
                status === 1
                  ? 'Duyệt lịch thực hành thành công!'
                  : 'Đã từ chối lịch thực hành!'
              );
              this.rowSelected = null;
              this.getListRegisterSchedule();
            } else {
              this.isLoading = false;
              this.notify.error(
                'Lỗi',
                status === 1
                  ? 'Duyệt lịch thực hành thất bại!'
                  : 'Từ chối thực hành thất bại!'
              );
            }
            resolve(res);
          },
          (error) => {
            reject(error);
            console.error(error);
            this.notify.error(
              'Lỗi',
              status === 1
                ? 'Duyệt lịch thực hành thất bại!'
                : 'Từ chối thực hành thất bại!'
            );
            this.isLoading = false;
          }
        );
    });
  }
  rejectRegisterSchedule() {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Lý do từ chối',
      nzContent: RejectRegisterSchedule,
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
          label: 'Từ chối',
          type: 'primary',
          autoLoading: false,
          onClick: async () => {
            const ref =
              modalRef.getContentComponent() as RejectRegisterSchedule;
            const res = (await this.handleAccept(
              2,
              ref.rejectReason
            )) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              modalRef.destroy();
              this.rowSelected = null;
            }
          },
        },
      ],
    });
  }
  formatDate(date: any) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '';
  }
  formatHour(hour: any) {
    return hour ? moment(hour, 'YYYYMMDDHHmmss').format('HH:mm') : '';
  }
}
