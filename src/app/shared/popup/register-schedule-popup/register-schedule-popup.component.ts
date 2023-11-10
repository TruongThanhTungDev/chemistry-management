import { Component, Input, inject, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { addHours, endOfDay, startOfDay } from 'date-fns';
import * as moment from 'moment';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
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
export class RegisterSchedulePopup implements OnInit {
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
      chemistryName: '',
      code: '',
      quantity: 0,
      unit: '',
    },
  ];
  isAddNewCalendar = false;
  selectedCalendar: any;
  constructor(
    private formBuilder: FormBuilder,
    private notify: NotificationService,
    private service: ApiServices
  ) {
    if (!this.isEdit) {
      this.registerInformation = this.formBuilder.group({
        date: [new Date(), [Validators.required]],
        className: ['', [Validators.required]],
        room: ['', [Validators.required]],
        startTime: [new Date().setHours(9, 0, 0), [Validators.required]],
        endTime: [new Date().setHours(10, 0, 0), [Validators.required]],
        description: [''],
      });
      this.viewDate = this.registerInformation.value.date;
      const payload = {
        start: this.registerInformation.value.startTime,
        end: this.registerInformation.value.endTime
          ? this.registerInformation.value.endTime
          : endOfDay(new Date()),
        title:
          this.registerInformation.value.className +
          ' ' +
          this.registerInformation.value.description,
      };
      this.events.push(payload);
    }
  }

  ngOnInit(): void {
    this.getAllLaboratory();
    this.getAllManager();
    this.getAllChemistry();
  }

  changeStartTime(event: any) {
    this.events.pop()
    const payload = {
      start: event,
      end: this.registerInformation.value.endTime,
      title:
        this.registerInformation.value.className +
        ' ' +
        this.registerInformation.value.description,
    };
    this.events.push(payload);
  }
  changeEndTime(event: any) {
    this.events.pop();
    const payload = {
      start: this.registerInformation.value.startTime,
      end: event,
      title:
        this.registerInformation.value.className +
        ' ' +
        this.registerInformation.value.description,
    };
    this.events.push(payload)
  }
  onCalendarChange(event: any) {
    this.events.pop();
    const day = parseInt(moment(event).format('YYYYMMDD'));
    this.registerInformation.patchValue({
      date: new Date(event),
      startTime: new Date(event).setHours(9, 0, 0),
      endTime: new Date(event).setHours(10, 0, 0),
    });
    const payload = {
      start: event,
      end: this.registerInformation.value.endTime,
      title:
        this.registerInformation.value.className +
        ' ' +
        this.registerInformation.value.description,
    };
    this.events.push(payload)
    this.getCalendarOfDay(day);
  }
  getCalendarOfDay(day: any) {
    this.isLoading = true;
    this.service
      .get(
        `${this.REQUEST_URL}/getPracticeScheldule?endTime=${day}&startTime=${day}`
      )
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isLoading = false;
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
      chemistryName: '',
      code: '',
      quantity: 0,
      unit: '',
    };
    this.listSelectChemisrty.push(newItem);
  }
  changeSelectedChemistry(event: any, index: any) {
    const result = this.listChemistry.find((item: any) => item.code === event)
    if (result) {
      this.listSelectChemisrty[index].unit = result.unit;
    }
  }
  disableItemSelect(item: any) {
    const arr = this.listSelectChemisrty.map((item: any) => item.code);
    return arr.includes(item)
  }
  removeSelectedChemistry(index: any) {
    if (this.listSelectChemisrty.length === 1) {
      return
    }
    this.listSelectChemisrty.splice(index,1)
  }
}