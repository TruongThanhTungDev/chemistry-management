import { Component, Input, inject } from "@angular/core";
import { NZ_MODAL_DATA, NzModalRef } from "ng-zorro-antd/modal";

@Component({
  selector: 'add-multiple-chemistry',
  templateUrl: './add-multiple-chemistry.component.html',
  styleUrls: ['./add-multiple-chemistry.component.scss'],
})
export class AddMultipleChemistryModal {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
}