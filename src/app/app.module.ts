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
import { AddEditChemistryComponent } from './shared/popup/add-edit-chemistry/add-edit-chemistry.component';
import { BasicInformationChemistry } from './shared/popup/add-edit-chemistry/basic-infomation-chemistry/basic-infomation-chemistry.component';
import { OtherInformationChemistry } from './shared/popup/add-edit-chemistry/other-information-chemistry/other-information-chemistry.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { BarcodeScanner } from './shared/popup/barcode-scanner/barcode-scanner.component';
import { AddMultipleChemistryModal } from './shared/popup/add-multiple-chemistry/add-multiple-chemistry.component';

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
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
