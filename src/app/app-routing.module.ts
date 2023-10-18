import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './pages/login/login.component';
import { UserRouteAccessService } from './user-route-access-service';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: LayoutComponent,
    // canActivate: [UserRouteAccessService],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./layout/layout.component.module').then(
            (x) => x.LayoutModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
