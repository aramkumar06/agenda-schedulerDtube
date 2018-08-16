import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {
  BaseComponent,
  DashboardComponent,
  LoginComponent,
  ScheduleComponent,
  UploadComponent
} from '../components';
import { LoginGuard } from '../guards/';
import {PostComponent} from "../components/userApp";

const routes: Routes = [
  { path: '', component: LoginComponent},
  { path: 'app', component: BaseComponent, canActivate: [LoginGuard], children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'upload', component: UploadComponent},
      {path: 'schedule', component: ScheduleComponent},
      {path: 'edit/:id', component: PostComponent}
  ]},
  { path: '**', redirectTo: 'app', pathMatch: 'full'}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {}
