import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'practice-register',
  templateUrl: './register-schedule.component.html',
  styleUrls: ['register-schedule.component.scss'],
})
export class RegisterSchedule implements OnInit {
  constructor() { }
  isLoading = false;
  date: any;
  listResgiter: any[] = []
  rowSelected: any
  page = 1
  totalItems = 0
  size = 10
  ngOnInit() { }
  selectRow(item: any) {

  }
  changePage(event: any) {
    
  }
}