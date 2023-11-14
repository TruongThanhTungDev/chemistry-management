import { HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import * as moment from 'moment';
import { NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ApiServices } from 'src/app/api.services';
import { AddEditChemistryComponent } from 'src/app/shared/popup/add-edit-chemistry/add-edit-chemistry.component';
import { AddMultipleChemistryByFile } from 'src/app/shared/popup/add-multiple-chemistry-by-file/add-multiple-chemistry-by-file.component';
import { AddMultipleChemistryModal } from 'src/app/shared/popup/add-multiple-chemistry/add-multiple-chemistry.component';
import { BarcodeScanner } from 'src/app/shared/popup/barcode-scanner/barcode-scanner.component';
import { PrintLablePopup } from 'src/app/shared/popup/print-label/print-label.component';
import { DataService } from 'src/app/shared/utils/dataService';
import { ExcelService } from 'src/app/shared/utils/export-excel.service';
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
  isAdded = true;
  itemPerPage = 10;
  totalItems = 0;
  chemiscalName: any;
  barcodeValue: any;
  infoUser: any;
  constructor(
    private service: ApiServices,
    private notify: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService,
    private excelService: ExcelService
  ) {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }
  get isStudent() {
    return this.infoUser && this.infoUser.role === 'student';
  }
  ngOnInit(): void {
    this.getDataChemistry();
    this.dataService.data$.subscribe((data: any) => {
      if (data) {
        this.selectItemByBarcode(data);
      }
    });
  }
  ngAfterViewInit(): void {}
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
    filter.push('orderStatus=in=(1,3)');
    filter.push(`isAdded==true`);
    if (this.barcodeValue) filter.push(`barcode==${this.barcodeValue}`);
    if (this.chemiscalName) filter.push(`name=="*${this.chemiscalName}*"`);
    return filter.join(';');
  }
  filterAllData() {
    const filter = [];
    filter.push('id>0');
    filter.push('orderStatus=in=(1,3)');
    filter.push(`isAdded==true`);
    filter.push('storageStatus==true');
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
          autoLoading: false,
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
    const modal = this.modal.create({
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
    return modal;
  }
  openMultipleAddModal() {
    let isLoadingBtn = false;
    const modalRef: NzModalRef = this.modal.create({
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
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modalRef.destroy(),
        },
        {
          label: 'Lưu',
          type: 'primary',
          loading: () => isLoadingBtn,
          onClick: async () => {
            const ref =
              modalRef.getContentComponent() as AddMultipleChemistryModal;
            if (!ref.listChecked.length) {
              isLoadingBtn = false;
              return;
            }
            const res = (await ref.addMultipleChemistry()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              modalRef.close();
              this.page = 1;
              this.getDataChemistry();
            } else {
              isLoadingBtn = false;
            }
          },
        },
      ],
    });
  }
  openMultipleAddByFile() {
    let isLoadingBtn = false;
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Thêm mới nhiều Chất hóa học với dữ liệu có sẵn',
      nzContent: AddMultipleChemistryByFile,
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
          autoLoading: false,
          onClick: async () => {
            const ref =
              modalRef.getContentComponent() as AddMultipleChemistryByFile;
            const res = (await ref.saveUploadFile()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              this.page = 1;
              this.getDataChemistry();
            }
          },
        },
      ],
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
      nzFooter: !this.isStudent ? [
        {
          label: 'In nhãn Chất',
          type: 'primary',
          onClick: () => this.openPrintLabel(item),
        },
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
              modalRef.getContentComponent() as AddEditChemistryComponent;
            const res = (await ref.saveInformation()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              modalRef.close();
              this.page = 1;
              this.getDataChemistry();
            }
          },
        },
      ] : [],
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
    this.isLoading = true;
    this.service
      .delete(`${this.REQUEST_URL}/delete`, this.rowSelected.id)
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isLoading = false;
            this.notify.success('Thông báo', 'Xóa dữ liệu thành công');
            this.page = 1;
            this.getDataChemistry();
          } else {
            this.isLoading = false;
            this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
          }
        },
        () => {
          this.isLoading = false;
          this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        }
      );
  }
  selectItemByBarcode(barcode: any) {
    this.barcodeValue = barcode;
    const payload = {
      page: 0,
      size: 99999,
      filter: this.filterData(),
      sort: ['id', 'desc'],
    };
    this.service
      .getOption(this.REQUEST_URL, payload, '/search')
      .subscribe((res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          if (res.body.RESULT.content.length) {
            this.barcodeValue = null;
            const result = res.body.RESULT.content.find(
              (item: any) => +item.barcode === +barcode
            );
            if (!result) {
              this.notify.error(
                'Lỗi',
                'Không tìm thấy chất hóa học phù hợp, vui lòng thử lại!'
              );
            } else {
              this.editChemistry(result);
            }
          } else {
            this.barcodeValue = null;
            this.notify.error(
              'Lỗi',
              'Không tìm thấy chất hóa học phù hợp, vui lòng thử lại!'
            );
          }
        }
      });
  }
  changePage(event: any) {
    this.page = event;
    this.getDataChemistry();
  }
  openPrintLabel(item: any) {
    const modal: NzModalRef = this.modal.create({
      nzTitle: 'In nhãn chất hóa học',
      nzContent: PrintLablePopup,
      nzViewContainerRef: this.viewContainerRef,
      nzCentered: true,
      nzData: {
        favoriteLibrary: 'angular',
        favoriteFramework: 'angular',
      },
      nzWidth: '100%',
      nzStyle: {
        height: '100%',
      },
      nzBodyStyle: {
        height: 'calc(100vh - 110px)',
      },
      nzFooter: [
        {
          label: 'Hủy',
          onClick: () => modal.destroy(),
        },
        {
          label: 'In',
          type: 'primary',
          autoLoading: false,
          onClick: () => {
            const ref = modal.getContentComponent() as PrintLablePopup;
            ref.printLabel();
          },
        },
      ],
    });
    modal.componentInstance.data = item;
  }
  getListexportToExcel() {
    let list = [];
    const payload = {
      page: 0,
      size: 99999,
      filter: this.filterAllData(),
      sort: ['id', 'desc'],
    };
    this.isLoading = true;
    this.service.getOption(this.REQUEST_URL, payload, '/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.isLoading = false;
          list = res.body.RESULT.content;
          this.exportToExcel(list);
        } else {
          this.isLoading = false;
        }
      },
      () => {
        console.error();
        this.isLoading = false;
      }
    );
  }
  exportToExcel(list: any) {
    const title = `Danh sách chất hóa học còn lại`;
    const header = [
      'Tên Hóa học',
      'Danh pháp',
      'Ký hiệu',
      'Loại chất',
      'Số lượng',
      'Hạn sử dụng',
      'Số mol',
      'Tính chất vật lý',
      'Tính chất hóa học',
      'Trạng thái tự nhiên',
    ];
    const name = 'EXPORT_DANH SÁCH HÓA HỌC_' + moment().format('DDMMYYYY');
    const data: any[] = [];
    const column = [35, 35, 15, 20, 15, 20, 25, 45, 45, 45];
    const footer = 'F';
    const align = [
      'left',
      'left',
      'left',
      'left',
      'left',
      'left',
      'left',
      'left',
      'left',
      'left',
    ];
    this.listChemistry.forEach((item: any) => {
      const entity = [
        item.name,
        item.nomenclature,
        item.formula,
        item.chemiscalType,
        item.quantity + item.unit,
        moment(item.expirationDate, 'YYYYMMDD').format('DD/MM/YYYY'),
        item.numberOfMoles ? item.numberOfMoles : '',
        item.physicalProperties,
        item.chemicalProperties,
        item.naturalStatus,
      ];
      data.push(entity);
    });
    this.excelService.generateExcel(
      title,
      header,
      data,
      name,
      footer,
      column,
      align
    );
  }
}
