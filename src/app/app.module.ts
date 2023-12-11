import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { LayoutComponent } from './layout/layout.component';
import { HeaderModule } from './shared/layout/header/header.component.module';
import { SidebarModule } from './shared/layout/sidebar/sidebar.component.module';
import { LoginComponent } from './pages/login/login.component';
import { NzInputModule } from 'ng-zorro-antd/input';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { HeadersInterceptor } from './headers-intercepter';
import { FormsModule } from '@angular/forms';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { AddEditChemistryComponent } from './shared/popup/add-edit-chemistry/add-edit-chemistry.component';
import { BasicInformationChemistry } from './shared/popup/add-edit-chemistry/basic-infomation-chemistry/basic-infomation-chemistry.component';
import { OtherInformationChemistry } from './shared/popup/add-edit-chemistry/other-information-chemistry/other-information-chemistry.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { NzFormModule } from 'ng-zorro-antd/form';
import { BarcodeScanner } from './shared/popup/barcode-scanner/barcode-scanner.component';
import { AddMultipleChemistryModal } from './shared/popup/add-multiple-chemistry/add-multiple-chemistry.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NZ_I18N, NzI18nModule, vi_VN } from 'ng-zorro-antd/i18n';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { registerLocaleData } from '@angular/common';
import vi from '@angular/common/locales/vi'
import { NgxBarcodeScannerModule } from '@eisberg-labs/ngx-barcode-scanner';
import { NgxBarcode6Module } from 'ngx-barcode6';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { DataService } from './shared/utils/dataService';
import { ImportChemistryPopup } from './shared/popup/import-chemistry-popup/import-chemistry-popup.component';
import { PrintLablePopup } from './shared/popup/print-label/print-label.component';
import { RegisterSchedulePopup } from './shared/popup/register-schedule-popup/register-schedule-popup.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { AddMultipleChemistryByFile } from './shared/popup/add-multiple-chemistry-by-file/add-multiple-chemistry-by-file.component';
import { RejectRegisterSchedule } from './shared/popup/reject-register-schedule/reject-register-schedule.component';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { commonReducer } from './shared/store/common/common.reducers';
registerLocaleData(vi)

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    LoginComponent,
    AddEditChemistryComponent,
    BasicInformationChemistry,
    OtherInformationChemistry,
    BarcodeScanner,
    AddMultipleChemistryModal,
    ImportChemistryPopup,
    PrintLablePopup,
    RegisterSchedulePopup,
    AddMultipleChemistryByFile,
    RejectRegisterSchedule,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NzButtonModule,
    HeaderModule,
    SidebarModule,
    NzInputModule,
    NzModalModule,
    HttpClientModule,
    NzNotificationModule,
    NzSpinModule,
    BrowserAnimationsModule,
    NzDropDownModule,
    AngularEditorModule,
    NzFormModule,
    ReactiveFormsModule,
    NzDatePickerModule,
    NzI18nModule,
    NzSelectModule,
    NgxBarcodeScannerModule,
    NgxBarcode6Module,
    NzTableModule,
    NzCheckboxModule,
    NzTimePickerModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    StoreModule.forRoot({
      common: commonReducer,
    }),
    StoreModule.forFeature('common', commonReducer),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
    { provide: NZ_I18N, useValue: vi_VN },
    DataService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
