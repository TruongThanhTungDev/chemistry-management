import { CommonModule } from "@angular/common";
import { ModuleWithProviders, NgModule } from "@angular/core";
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
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzCarouselModule } from 'ng-zorro-antd/carousel';
import { ChemistryManagement } from "../pages/chemistry-management/chemistry-management.component";
import { ImportChemistry } from "../pages/import-chemistry/import-chemistry.component";
import { RegisterSchedule } from "../pages/register-schedule/register-schedule.component";
import { ExcelService } from "../shared/utils/export-excel.service";
import { HelpComponent } from "../pages/help/help.component";
import { ChemistryManagementHelp } from "../pages/help/chemistry-management-help/chemistry-management-help.component";
import { ImportChemistryHelp } from "../pages/help/import-chemistry-help/import-chemistry-help.component";
import { RegisterScheduleHelp } from "../pages/help/register-schedule-help/register-schedule-help.component";
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
    NzDatePickerModule,
    NzTabsModule,
    NzCarouselModule,
  ],
  declarations: [
    ChemistryManagement,
    ImportChemistry,
    RegisterSchedule,
    HelpComponent,
    ChemistryManagementHelp,
    ImportChemistryHelp,
    RegisterScheduleHelp,
  ],
  providers: [ExcelService],
})
export class LayoutModule {}