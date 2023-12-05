import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";

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
      permission: ['student', 'admin', 'teacher'],
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
      name: 'Hỗ trợ kỹ thuật',
      path: 'help',
      icon: 'fa-solid fa-circle-info',
      permission: ['student', 'admin', 'teacher'],
    },
  ];
  currentRouter: any;
  infoUser: any;
  constructor(private router: Router, private route: ActivatedRoute) {}
  ngOnInit(): void {
    this.infoUser = JSON.parse(localStorage.getItem('infoUser') as any);
  }
}