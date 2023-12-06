import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../utils/toast.service';
import { ApiServices } from 'src/app/api.services';
import { HttpResponse } from '@angular/common/http';
import { Store } from '@ngrx/store';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'header-component',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  listNotificaion: any[] = [];
  currentNotify: any;
  noneReadingCount = 0;
  infoUser: any;
  page = 1;
  itemPerPage = 10;
  REQUEST_URL = 'api/v1/notifications';
  timeInterval: any;
  constructor(
    private service: ApiServices,
    private notify: NotificationService,
    private store: Store<any>,
    private router: Router
  ) {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }
  ngOnInit(): void {
    this.getListNotify();
    // this.timeInterval = setInterval(() => {
    //   this.getFirstNotify();
    // }, 1500);
  }
  ngOnDestroy(): void {
    if (this.timeInterval) {
      clearInterval(this.timeInterval);
    }
  }
  getListNotify() {
    const payload = {
      page: this.page - 1,
      size: this.itemPerPage,
      filter: this.filterData(),
      sort: ['id', 'desc'],
    };
    this.service.getOption(this.REQUEST_URL, payload, '/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.countUnReadNotify();
          this.listNotificaion = res.body.RESULT.content;
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  getFirstNotify() {
    this.service.get(this.REQUEST_URL + '/getNotication').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          if (this.currentNotify && res.body.RESULT.id > this.currentNotify) {
            this.notify.success('', res.body.RESULT.message, 'bottomRight');
            this.currentNotify = res.body.RESULT.id;
          } else {
            this.currentNotify = res.body.RESULT.id;
          }
          this.countUnReadNotify();
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  changeNotify(id: any, practiceSchelduleId: any) {
    this.service
      .post(this.REQUEST_URL + `/changeNotification?notificationId=${id}`, '')
      .subscribe(
        (res: any) => {
          console.log('res :>> ', res);
          if (res.CODE === 200) {
            this.getListNotify();
            this.countUnReadNotify();
            this.viewScheduleWithNotify(practiceSchelduleId);
          }
        },
        (err: any) => {
          console.error(err);
        }
      );
  }
  countUnReadNotify() {
    const payload = {
      page: this.page - 1,
      size: 100000,
      filter: `id>0;isRead=='false';accountId.id==${this.infoUser.id}`,
      sort: ['id', 'desc'],
    };
    this.service.getOption(this.REQUEST_URL, payload, '/search').subscribe(
      (res: HttpResponse<any>) => {
        if (res.body.CODE === 200) {
          this.noneReadingCount = res.body.RESULT.totalElements;
        }
      },
      (err: any) => {
        console.error(err);
      }
    );
  }
  filterData() {
    const filter = [];
    filter.push('id>0');
    filter.push(`accountId.id==${this.infoUser.id}`);
    return filter.join(';');
  }
  formatDate(date: any) {
    return date
      ? moment(date, 'YYYYMMDDHHmmss').format('HH:mm DD/MM/YYYY')
      : '';
  }
  viewScheduleWithNotify(id: any) {
    this.store.dispatch({
      type: 'SET_IS_VIEW_SCHEDULE',
      id,
      isViewSchedule: true,
    });
    this.router.navigate(['register-schedule']);
  }
}
