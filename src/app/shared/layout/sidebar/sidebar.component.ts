import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";

@Component({
  selector: 'sidebar-component',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menu: any[] = [
    {
      name: 'Quản lý chất hóa học',
      path: '',
      icon: 'fa-solid fa-flask',
      permission: ['student', 'admin'],
    },
    {
      name: 'Nhập hàng',
      path: 'import-chemistry',
      icon: 'fa-solid fa-cart-arrow-down',
      permission: ['admin'],
    },
    {
      name: 'Đăng ký thực hành',
      path: 'register-schedule',
      icon: 'fa-solid fa-person-circle-plus',
      permission: ['teacher', 'admin'],
    },
    {
      name: 'Chat GPT',
      path: 'chat-gpt',
      icon: 'fa-brands fa-rocketchat',
      permission: ['student', 'admin', 'teacher'],
    },
  ];
  currentRouter: any;
  infoUser: any;
  constructor(private router: Router) {}
  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }
}