import { HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiServices } from 'src/app/api.services';
import { RxStompService } from 'src/app/rx-stomp.service';
import { NotificationService } from 'src/app/shared/utils/toast.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  userName: any;
  password: any;
  isShowPassword = false;
  isLoading = false;
  REQUEST_URL = 'api/v1/account/login';
  constructor(
    private service: ApiServices,
    private router: Router,
    private notify: NotificationService,
    private rxStompService: RxStompService
  ) {}
  ngOnInit(): void {
    localStorage.clear();
  }
  showPassword() {
    this.isShowPassword = !this.isShowPassword;
  }
  login(guest = false) {
    if (!guest) {
      const payload = {
        passWord: this.password,
        userName: this.userName.trim(),
      };
      this.isLoading = true;
      this.service.postOption(this.REQUEST_URL, payload, '').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            localStorage.setItem('infoUser', JSON.stringify(res.body.RESULT));
            localStorage.setItem('token', res.body.RESULT.object);
            this.notify.success('Thông báo', 'Đăng nhập thành công');
            setTimeout(() => {
              this.isLoading = false;
              this.router.navigate(['']);
            }, 200);
          } else {
            this.isLoading = false;
            this.notify.warning('Lỗi', res.body.MESSAGE);
          }
        },
        () => {
          this.isLoading = false;
          console.error();
          this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        }
      );
    } else {
      const payload = {
        passWord: '123456',
        userName: 'student',
      };
      this.isLoading = true;
      this.service.postOption(this.REQUEST_URL, payload, '').subscribe(
        (res: HttpResponse<any>) => {
          if (res.body.CODE === 200) {
            localStorage.setItem('infoUser', JSON.stringify(res.body.RESULT));
            localStorage.setItem('token', res.body.RESULT.object);
            this.notify.success('Thông báo', 'Đăng nhập thành công');
            setTimeout(() => {
              this.isLoading = false;
              this.router.navigate(['']);
            }, 200);
          } else {
            this.isLoading = false;
            this.notify.warning('Lỗi', res.body.MESSAGE);
          }
        },
        () => {
          this.isLoading = false;
          console.error();
          this.notify.error('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại');
        }
      );
    }
  }
}
