import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HeaderComponent } from "./header.component";
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
@NgModule({
  imports: [RouterModule, CommonModule, NzDropDownModule],
  declarations: [HeaderComponent],
  exports: [HeaderComponent],
})
export class HeaderModule {}