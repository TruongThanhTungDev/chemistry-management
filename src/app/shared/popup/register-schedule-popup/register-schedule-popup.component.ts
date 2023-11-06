import { Component, Input, inject } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { endOfDay, startOfDay } from 'date-fns';
import * as moment from 'moment';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import {
  FormControl,
  FormGroup,
  Validators,
  FormBuilder,
} from '@angular/forms';

@Component({
  selector: 'register-schedule-popup',
  templateUrl: './register-schedule-popup.component.html',
  styleUrls: ['register-schedule-popup.component.scss'],
})
export class RegisterSchedulePopup {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  @Input() data: any;
  @Input() isEdit = false;
  viewDate: Date = new Date();
  registerInformation: FormGroup;
  selectedDateTime: any[] = [new Date(), new Date()];
  selectRoom: any;
  events: CalendarEvent[] = [];
  constructor(private formBuilder: FormBuilder) {
    this.registerInformation = this.formBuilder.group({
      date: [new Date(), [Validators.required]],
      room: ['', [Validators.required]],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
      note: [''],
    });
  }
  onChange(event: any) {}
  onCalendarChange(event: any) {}
}