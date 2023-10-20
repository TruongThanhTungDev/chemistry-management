import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LayoutRoutes } from "./layout.routing";
import { FormsModule } from "@angular/forms";
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ChemistryManagement } from "../pages/chemistry-management/chemistry-management.component";
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LayoutRoutes),
    FormsModule,
    NzInputModule,
    NzIconModule,
    NzButtonModule,
    NzDropDownModule,
    NzTableModule,
    NzPaginationModule,
    NzSpinModule,
  ],
  declarations: [ChemistryManagement],
  providers: [],
})
export class LayoutModule {}