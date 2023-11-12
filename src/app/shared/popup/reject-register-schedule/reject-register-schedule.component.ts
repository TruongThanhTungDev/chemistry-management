import { Component, inject } from "@angular/core";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";

@Component({
  selector: 'reject-register-schedule',
  templateUrl: './reject-register-schedule.component.html',
})
export class RejectRegisterSchedule {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  rejectReason: any
}