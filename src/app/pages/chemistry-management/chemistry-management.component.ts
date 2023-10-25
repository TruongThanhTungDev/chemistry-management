import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiServices } from 'src/app/api.services';
import { AddEditChemistryComponent } from 'src/app/shared/popup/add-edit-chemistry/add-edit-chemistry.component';
import { AddMultipleChemistryModal } from 'src/app/shared/popup/add-multiple-chemistry/add-multiple-chemistry.component';
import { BarcodeScanner } from 'src/app/shared/popup/barcode-scanner/barcode-scanner.component';
import { NotificationService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'chemistry-management',
  templateUrl: './chemistry-management.component.html',
  styleUrls: ['./chemistry-management.component.scss'],
})
export class ChemistryManagement implements OnInit, AfterViewInit {
  @ViewChild('addModal') addModal!: AddEditChemistryComponent;
  @ViewChild('barcode') barcode!: BarcodeScanner;
  REQUEST_URL = 'api/v1/Chemiscal';
  listChemistry: any[] = [];
  rowSelected: any;
  isLoading = false;
  page = 1;
  itemPerPage = 10;
  totalItems = 0;
  chemiscalName: any;
  constructor(
    private service: ApiServices,
    private notify: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.getDataChemistry();
  }
  ngAfterViewInit(): void {
    this.barcode.barcode.subscribe((data: any) => {
      console.log('data :>> ', data);    
    })
  }
  getDataChemistry() {
    const payload = {
      page: this.page - 1,
      size: this.itemPerPage,
      filter: this.filterData(),
      sort: ['id', 'desc'],
    };
    this.isLoading = true;
    this.service.getOption(this.REQUEST_URL, payload, '/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.isLoading = false;
          this.listChemistry = res.body.RESULT.content;
          this.totalItems = res.body.RESULT.totalElements;
        } else {
          this.isLoading = false;
          this.notify.error('Lỗi', 'Lấy danh sách thất bại');
        }
      },
      () => {
        this.isLoading = false;
        console.error();
        this.notify.error('Lỗi', 'Lấy danh sách thất bại');
      }
    );
  }
  filterData() {
    const filter = [];
    filter.push('id>0');
    if (this.chemiscalName) filter.push(`name==*${this.chemiscalName}*`);
    return filter.join(';');
  }
  openAddChemistryModal() {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Thêm mới chất hóa học',
      nzContent: AddEditChemistryComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '1100px',
      nzBodyStyle: {
        height: '570px',
        overflowY: 'auto',
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
            const ref =
              modalRef.getContentComponent() as AddEditChemistryComponent;
            const res = (await ref.saveInformation()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              modalRef.close();
              this.page = 1;
              this.getDataChemistry();
            }
          },
        },
      ],
    });
  }
  openBarcodeScannerModal() {
    this.modal.create({
      nzTitle: 'Quét mã Barcode',
      nzContent: BarcodeScanner,
      nzViewContainerRef: this.viewContainerRef,
      nzCentered: true,
      nzData: {
        favoriteLibrary: 'angular',
        favoriteFramework: 'angular',
      },
      nzFooter: null,
    });
  }
  openMultipleAddModal() {
    this.modal.create({
      nzTitle: 'Thêm mới nhiều Chất hóa học',
      nzContent: AddMultipleChemistryModal,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '1100px',
      nzBodyStyle: {
        height: '570px',
        overflowY: 'auto',
      },
      nzCentered: true,
      nzData: {
        favoriteLibrary: 'angular',
        favoriteFramework: 'angular',
      },
      nzOkText: 'Lưu',
      nzCancelText: 'Hủy',
      nzOkType: 'primary',
      nzOnOk: () => {
        //  this.page = 1;
        //  this.getDataChemistry();
      },
    });
  }
  editChemistry(item: any) {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Chỉnh sửa thông tin chất hóa học',
      nzContent: AddEditChemistryComponent,
      nzViewContainerRef: this.viewContainerRef,
      nzWidth: '1100px',
      nzBodyStyle: {
        height: '570px',
        overflowY: 'auto',
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
            const ref =
              modalRef.getContentComponent() as AddEditChemistryComponent;
            const res = (await ref.saveInformation()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              modalRef.close();
              this.page = 1;
              this.getDataChemistry();
            }
          },
        },
      ],
    });
    modalRef.componentInstance.data = item;
    modalRef.componentInstance.isEdit = true;
  }
  selectRow(item: any) {
    if (this.rowSelected && this.rowSelected.id === item.id) {
      this.rowSelected = null;
    } else {
      this.rowSelected = item;
    }
  }
  formatDate(date: any) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '';
  }
  clearData() {
    this.page = 1;
    this.chemiscalName = '';
    this.getDataChemistry();
  }
  deleteChemistry() {
    this.modal.create({
      nzTitle: 'Xóa Chất hóa học',
      nzContent:
        '<div class="text-center">Bạn có chắc chắn muốn xóa thông tin chất hóa học này!</div>',
      nzCentered: true,
      nzOkText: 'Lưu',
      nzCancelText: 'Hủy',
      nzOkType: 'primary',
      nzOnOk: () => {
        this.handleDelete();
      },
    });
  }
  handleDelete() {
    this.isLoading = true
    this.service.delete(`${this.REQUEST_URL}/delete`, this.rowSelected.id)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isLoading = false
            this.notify.success('Thông báo', 'Xóa dữ liệu thành công')
            this.page = 1
            this.getDataChemistry()
          } else {
            this.isLoading = false;
            this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
          }
        },
        () => {
           this.isLoading = false;
           this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        }
    )
  }
}
