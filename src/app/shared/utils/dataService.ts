import { Injectable } from "@angular/core";
import { Subject } from "rxjs";

@Injectable()
export class DataService {
  private dataSubject = new Subject<any>()

  data$ = this.dataSubject.asObservable()

  sendData(data:any) {
    this.dataSubject.next(data)
  }
}