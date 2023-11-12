import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { NzModalRef, NzModalService } from "ng-zorro-antd/modal";
import { ApiServices } from "src/app/api.services";
import { ImportChemistryPopup } from 'src/app/shared/popup/import-chemistry-popup/import-chemistry-popup.component';
import { DataService } from 'src/app/shared/utils/dataService';
import { NotificationService } from "src/app/shared/utils/toast.service";
import { HttpResponse } from '@angular/common/http';
import * as moment from 'moment';
import { ExcelService } from 'src/app/shared/utils/export-excel.service';
@Component({
  selector: 'import-chemistry',
  templateUrl: './import-chemistry.component.html',
  styleUrls: ['./import-chemistry.component.scss'],
})
export class ImportChemistry implements OnInit {
  REQUEST_URL = 'api/v1/Chemiscal';
  isLoading = false;
  page = 1;
  itemPerPage = 10;
  totalItems = 0;
  orderStatus: any;
  listChemistry: any[] = [];
  rowSelected: any;
  date = [new Date(), new Date()];
  constructor(
    private service: ApiServices,
    private notify: NotificationService,
    private modal: NzModalService,
    private viewContainerRef: ViewContainerRef,
    private dataService: DataService,
    private excelService: ExcelService
  ) {}
  ngOnInit(): void {
    this.getDataChemistry();
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
    const startDate = parseInt(moment(this.date[0]).format('YYYYMMDD000000'));
    const endDate = parseInt(moment(this.date[1]).format('YYYYMMDD235959'));
    const filter = [];
    filter.push('id>0');
    filter.push(`isAdded=='false'`);
    filter.push(`orderAt>=${startDate}`);
    filter.push(`orderAt<=${endDate}`);
    if (this.orderStatus) filter.push(`orderStatus=in=(${this.orderStatus})`);
    return filter.join(';');
  }
  filterByStatus(status: any) {
    this.orderStatus = status;
    this.getDataChemistry();
  }
  changeStatus(chemiscalId: any, status: any) {
    const payload = {
      chemiscalId,
      status,
    };
    this.isLoading = true;
    this.service
      .postOption(this.REQUEST_URL, payload, '/changeStoreStatus')
      .subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            this.isLoading = false;
            this.getDataChemistry();
          } else {
            this.isLoading = false;
            this.notify.error('Lỗi', res.body.MESSAGE);
          }
        },
        () => {
          console.error();
          this.isLoading = false;
          this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        }
      );
  }
  openImportPopup() {
    const modalRef: NzModalRef = this.modal.create({
      nzTitle: 'Nhập dữ liệu',
      nzContent: ImportChemistryPopup,
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
            const ref = modalRef.getContentComponent() as ImportChemistryPopup;
            if (!ref.selectedFile) {
              this.notify.warning('Cảnh báo', 'Vui lòng chọn tệp dữ liệu');
              return;
            }
            const res = (await ref.saveUploadFile()) as HttpResponse<any>;
            if (res.body.CODE === 200) {
              this.getDataChemistry();
            }
          },
        },
      ],
    });
  }
  deleteChemistry() {
    this.modal.create({
      nzTitle: 'Xóa Chất hóa học',
      nzContent:
        '<div class="text-center">Bạn có chắc chắn muốn xóa thông tin Đơn hàng này!</div>',
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
  selectRow(item: any) {
    if (this.rowSelected && this.rowSelected.id === item.id) {
      this.rowSelected = null;
    } else {
      this.rowSelected = item;
    }
  }
  changeDate(event: any) {
    this.page = 1
    this.getDataChemistry();
  }

  changePage(event: any) {
    this.page = event;
    this.getDataChemistry();
  }

  formatDate(date: any) {
    return date ? moment(date, 'YYYYMMDD').format('DD/MM/YYYY') : '';
  }
  exportToExcel() {
    const title = `Đơn hàng Nhập chất hóa học từ ${moment(this.date[0]).format(
      'DD/MM/YYYY'
    )}-${moment(this.date[1]).format('DD/MM/YYYY')}`;
    const header = [
      'Tên Hóa học',
      'Danh pháp',
      'Ký hiệu',
      'Số lượng',
      'Hạn sử dụng',
      'Ngày nhập',
      'Trạng thái đơn',
    ];
    const startDate = moment(this.date[0]).format('YYYYMMDD');
    const endDate = moment(this.date[1]).format('YYYYMMDD');
    const name = 'CHEM_ORDER-' + startDate + '_' + endDate;
    const data: any[] = [];
    const column = [35, 35, 15, 15, 20, 25, 15];
    const footer = 'F';
    const align = ['left', 'left', 'left', 'left', 'left', 'left', 'left'];
    this.listChemistry.forEach((item: any) => {
      const entity = [
        item.name,
        item.nomenclature,
        item.formula,
        item.quantity,
        moment(item.expirationDate, 'YYYYMMDD').format('DD/MM/YYYY'),
        moment(item.orderAt, 'YYYYMMDDHHmmss').format('DD/MM/YYYY'),
        item.orderStatus == 0
          ? 'Đang chờ'
          : item.orderStatus == 1
          ? 'Đã nhận'
          : 'Hủy',
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