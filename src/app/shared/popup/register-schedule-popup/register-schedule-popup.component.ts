import { Component, Input, inject, OnInit, AfterViewInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import * as moment from 'moment';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { ApiServices } from 'src/app/api.services';
import { NotificationService } from '../../utils/toast.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'register-schedule-popup',
  templateUrl: './register-schedule-popup.component.html',
  styleUrls: ['register-schedule-popup.component.scss'],
})
export class RegisterSchedulePopup implements OnInit, AfterViewInit {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  @Input() data: any;
  @Input() isEdit = false;
  REQUEST_URL = 'api/v1/practiceScheldule';
  REQUEST_LABORATORY_URL = 'api/v1/leboratory';
  REQUEST_USER_URL = 'api/v1/account';
  REQUEST_CHEMISCAL_URL = 'api/v1/Chemiscal';
  viewDate!: Date;
  registerInformation!: FormGroup;
  selectedDateTime: any[] = [new Date(), new Date()];
  selectRoom: any;
  events: CalendarEvent[] = [];
  isLoading = false;
  listLaboratory: any[] = [];
  listManager: any[] = [];
  listChemistry: any[] = [];
  listSelectChemisrty: any[] = [
    {
      id: '',
      quantity: 0,
      unit: '',
    },
  ];
  isAddNewCalendar = false;
  selectedCalendar: any;
  infoUser: any;
  constructor(
    private formBuilder: FormBuilder,
    private notify: NotificationService,
    private service: ApiServices,
    private modal: NzModalService
  ) {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }

  ngOnInit(): void {
    if (!this.isEdit) {
      this.registerInformation = this.formBuilder.group({
        datetime: [new Date(), [Validators.required]],
        className: ['', [Validators.required]],
        laboratoryId: ['', [Validators.required]],
        startTime: [new Date().setHours(0, 0, 0), [Validators.required]],
        endTime: [new Date().setHours(1, 0, 0), [Validators.required]],
        description: [''],
        managerId: ['', [Validators.required]],
        status: [0],
      });
    } else {
      const dateTimeData = this.getDateTime(this.data.datetime);
      this.registerInformation = this.formBuilder.group({
        datetime: [dateTimeData, [Validators.required]],
        className: [this.data.className, [Validators.required]],
        laboratoryId: [
          this.data.laboratory ? this.data.laboratory.id : '',
          [Validators.required],
        ],
        startTime: [
          this.getTimeConvert(this.data.startTime),
          [Validators.required],
        ],
        endTime: [
          this.getTimeConvert(this.data.endTime),
          [Validators.required],
        ],
        description: [this.data.description],
        managerId: [
          this.data.manager ? this.data.manager.id : '',
          [Validators.required],
        ],
        status: [this.data.status],
      });
      this.listSelectChemisrty = JSON.parse(this.data.chemiscal)
    }
    this.viewDate = this.registerInformation.value.datetime;
    this.getAllLaboratory();
    this.getAllManager();
    this.getAllChemistry();
    this.getCalendarOfDay(this.registerInformation.value.datetime, this.isEdit ? this.data.id : '');
  }

  ngAfterViewInit(): void { }

  changeStartTime(event: any) {
    this.events.pop();
    const payload = {
      start: new Date(event),
      end: new Date(this.registerInformation.value.endTime),
      title:
        this.registerInformation.value.className +
        ' ' +
        this.registerInformation.value.description,
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
    };
    this.events = [...this.events, payload];
  }
  changeEndTime(event: any) {
    this.events.pop();
    const payload = {
      start: new Date(this.registerInformation.value.startTime),
      end: new Date(event),
      title:
        this.registerInformation.value.className +
        ' ' +
        this.registerInformation.value.description,
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
    };
    this.events = [...this.events, payload];
  }
  onCalendarChange(event: any) {
    this.events.pop();
    this.registerInformation.patchValue({
      startTime: new Date(event).setHours(0, 0, 0),
      endTime: new Date(event).setHours(1, 0, 0),
    });
    this.getCalendarOfDay(event);
  }
  showDateInCalendar() {
    this.events.pop();
    const payload = {
      start: new Date(this.registerInformation.value.startTime),
      end: new Date(this.registerInformation.value.endTime),
      title:
        this.registerInformation.value.className +
        ' ' +
        this.registerInformation.value.description,
      color: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
      },
    };
    this.events = [...this.events, payload];
  }
  getCalendarOfDay(day: any, id = null) {
    const datetime = parseInt(moment(day).format('YYYYMMDD'));
    this.isLoading = true;
    this.service
      .get(`${this.REQUEST_URL}/getPracticeScheldule?dateTime=${datetime}`)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isLoading = false;
            const listSchedule = res.body.RESULT
            if (this.isEdit) {
              const currentTime = listSchedule.findIndex((item: any) => item.id === id);
              if (currentTime !== -1) {
                listSchedule.splice(currentTime, 1);
              }
            }
            const result = listSchedule.map((item: any) => ({
              start: new Date(moment(item.startTime, 'YYYYMMDDHHmmss') as any),
              end: new Date(moment(item.endTime, 'YYYYMMDDHHmmss') as any),
              title: item.className + ' ' + item.description,
              color: {
                primary: '#1e90ff',
                secondary: '#D1E8FF',
              },
            }));
            const payload = {
              end: new Date(this.registerInformation.value.endTime),
              start: new Date(this.registerInformation.value.startTime),
              title:
                this.registerInformation.value.className +
                ' ' +
                this.registerInformation.value.description,
              color: {
                primary: '#ad2121',
                secondary: '#FAE3E3',
              },
            };
            this.events = [...result, payload];
          }
        },
        () => {
          this.isLoading = false;
          console.error();
        }
      );
  }
  getAllLaboratory() {
    this.service.get(`${this.REQUEST_LABORATORY_URL}/getAll`).subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.listLaboratory = res.body.RESULT;
        }
      },
      () => {
        console.error();
      }
    );
  }
  getAllManager() {
    const payload = {
      page: 0,
      size: 9999,
      filter: this.filterUser(),
      sort: ['id', 'asc'],
    };
    this.service
      .getOption(this.REQUEST_USER_URL, payload, '/search')
      .subscribe((res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.listManager = res.body.RESULT.content;
        }
      });
  }
  filterUser() {
    const filter = [];
    filter.push('id>0');
    filter.push('role==admin');
    return filter.join(';');
  }
  getAllChemistry() {
    const payload = {
      page: 0,
      size: 9999,
      filter: this.filterChemistry(),
      sort: ['id', 'asc'],
    };
    this.service
      .getOption(this.REQUEST_CHEMISCAL_URL, payload, '/search')
      .subscribe((res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.listChemistry = res.body.RESULT.content.map((item: any) => ({
            ...item,
            fullName: `${item.name} (${item.barcode})`,
          }));
        }
      });
  }
  filterChemistry() {
    const filter = [];
    filter.push('id>0');
    filter.push('orderStatus=in=(1,3)');
    filter.push(`isAdded==true`);
    return filter.join(';');
  }
  addNewChooseChemistry() {
    const newItem = {
      id: '',
      quantity: 0,
      unit: '',
    };
    this.listSelectChemisrty.push(newItem);
  }
  changeSelectedChemistry(event: any, index: any) {
    const result = this.listChemistry.find((item: any) => item.id === event);
    if (result) {
      this.listSelectChemisrty[index].unit = result.unit;
    }
  }
  disableItemSelect(item: any) {
    const arr = this.listSelectChemisrty.map((item: any) => item.code);
    return arr.includes(item);
  }
  removeSelectedChemistry(index: any) {
    if (this.listSelectChemisrty.length === 1) {
      return;
    }
    this.listSelectChemisrty.splice(index, 1);
  }
  saveRegisterSchedule() {
    return new Promise((resolve: any, reject: any) => {
      if (!this.validateForm()) {
        return;
      }
      const startTime = parseInt(
        moment(this.registerInformation.value.startTime).format(
          'YYYYMMDDHHmmss'
        )
      );
      const endTime = parseInt(
        moment(this.registerInformation.value.endTime).format('YYYYMMDDHHmmss')
      );
      this.service
        .post(
          `${this.REQUEST_URL}/checkDuplicateSchedule?endTime=${endTime}&startTime=${startTime}`,
          ''
        )
        .subscribe(
          (res: any) => {
            if (res.CODE === 200) {
              if (!res.RESULT) {
                this.handleSaving(resolve, reject);
              } else {
                this.checkingDuplicate(resolve, reject);
              }
            }
          },
          () => {
            console.error();
          }
        );
    });
  }
  checkingDuplicate(resolve: any, reject: any) {
    this.modal.create({
      nzTitle: 'Trùng lịch!',
      nzContent:
        '<div class="text-center">Lịch hiện tại đang chọn đã bị trùng, bạn có muốn tiếp tục không?</div>',
      nzCentered: true,
      nzOkText: 'Lưu',
      nzCancelText: 'Hủy',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.handleSaving(resolve, reject);
      },
    });
  }
  handleSaving(resolve: any, reject: any) {
    const payload = {
      chemiscalInfo: this.listSelectChemisrty,
      ...this.registerInformation.value,
      datetime: this.registerInformation.value.datetime
        ? parseInt(
            moment(this.registerInformation.value.datetime).format('YYYYMMDD')
          )
        : 0,
      startTime: this.registerInformation.value.startTime
        ? parseInt(
            moment(this.registerInformation.value.startTime).format(
              'YYYYMMDDHHmmss'
            )
          )
        : 0,
      endTime: this.registerInformation.value.endTime
        ? parseInt(
            moment(this.registerInformation.value.endTime).format(
              'YYYYMMDDHHmmss'
            )
          )
        : 0,
      teacherName: this.infoUser.fullName,
    };
    this.isLoading = true;
    if (!this.isEdit) {
      this.service
        .postOption(this.REQUEST_URL, payload, '/createPracticeSchedule')
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              resolve(res);
              this.isLoading = false;
              this.notify.success(
                'Thông báo',
                'Đăng ký phòng thực hành thành công!'
              );
              this.#modal.close();
            } else {
              resolve(res);
              this.isLoading = false;
              this.notify.error('Lỗi', 'Đăng ký phòng thực hành thất bại!');
            }
          },
          () => {
            reject();
            console.error();
            this.isLoading = false;
            this.notify.error('Lỗi', 'Đăng ký phòng thực hành thất bại!');
          }
        );
    } else {
      payload.id = this.data.id
      this.service
        .put(this.REQUEST_URL, payload, `/updatePracticeSchedule?id=${this.data.id}`)
        .subscribe(
          (res: HttpResponse<any>) => {
            if (res.body.CODE === 200) {
              resolve(res);
              this.isLoading = false;
              this.notify.success(
                'Thông báo',
                'Sửa thông tin đăng ký phòng thực hành thành công!'
              );
              this.#modal.close();
            } else {
              resolve(res);
              this.isLoading = false;
              this.notify.error(
                'Lỗi',
                'Sửa thông tin đăng ký phòng thực hành thất bại!'
              );
            }
          },
          () => {
            reject();
            console.error();
            this.isLoading = false;
            this.notify.error(
              'Lỗi',
              'Sửa thông tin đăng ký phòng thực hành thất bại!'
            );
          }
        );
    }
  }
  validateForm() {
    if (this.registerInformation && this.registerInformation.invalid) {
      Object.values(this.registerInformation.controls).forEach((control: any) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return false;
    } else {
      return true;
    }
  }
  getDateTime(date: number) {
    const year = parseInt(date.toString().substring(0, 4), 10)
    const month = parseInt(date.toString().substring(4, 6), 10) - 1;
    const day = parseInt(date.toString().substring(6, 8), 10);
    return new Date(year, month, day);
  }
  getTimeConvert(time: number) {
    const dateTime = new Date(
      parseInt(time.toString().substring(0, 4), 10),
      parseInt(time.toString().substring(4, 6), 10) - 1,
      parseInt(time.toString().substring(6, 8), 10),
      parseInt(time.toString().substring(8, 10), 10),
      parseInt(time.toString().substring(10, 12), 10),
      parseInt(time.toString().substring(12, 14), 10)
    );
    return dateTime
  }
}
