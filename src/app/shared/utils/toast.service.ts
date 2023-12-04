import { Injectable } from "@angular/core";
import {NzNotificationService} from 'ng-zorro-antd/notification'
@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(protected notify: NzNotificationService) {}
  success(title: any, content: any, placement = 'topRight') {
    this.notify.success(title, content, {
      nzPlacement: placement as any,
    });
  }
  info(title: any, content: any) {
    this.notify.info(title, content);
  }
  warning(title: any, content: any) {
    this.notify.warning(title, content);
  }
  error(title: any, content: any) {
    this.notify.error(title, content);
  }
}