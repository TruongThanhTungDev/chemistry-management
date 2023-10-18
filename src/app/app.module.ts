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

@NgModule({
  declarations: [AppComponent, LayoutComponent, LoginComponent],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    NzButtonModule,
    HeaderModule,
    SidebarModule,
    NzInputModule,
    HttpClientModule,
    NzNotificationModule,
    NzSpinModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
