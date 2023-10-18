import { Component, Input, inject } from '@angular/core'
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'add-edit-chemistry',
  templateUrl: './add-edit-chemistry.component.html',
})
export class AddEditChemistryComponent {
  @Input() title?: string;
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  
}