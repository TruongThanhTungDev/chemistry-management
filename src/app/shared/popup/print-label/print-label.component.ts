import { Component, Input, inject } from '@angular/core'; 
import * as moment from 'moment';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
@Component({
  selector: 'print-label',
  templateUrl: './print-label.component.html',
})
export class PrintLablePopup {
  readonly #modal = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);
  @Input() data: any;
  formatDate(date: any) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '';
  }
  printLabel() {
    console.log('12 :>> ', 12);
    var element = document.getElementById('element-to-print');
    const finalEle = element?.innerHTML;
    let str = '<html><head><title>Tour</title>'
    str += '</head><body>';
    str += finalEle;
    str += '</body></html>';
    var opt = {
      margin: [0.5, 0.5, 0.5, 0.5],
      filename: this.data.name + '-label' ,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
      pagebreak: { mode: 'avoid-all' },
    };
    html2pdf().set(opt).from(str).save();
  }
}
declare let html2pdf: any;