import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {
  AppComponent,
  BaseComponent,
  LoginComponent,
  DashboardComponent,
  ViewLogComponent,
  UploadComponent, ScheduleComponent
} from './components';
import {AppRoutingModule, MaterialModule} from './modules';
import {
  AuthService,
  SchedulerService,
  DialogService,
  LogsService,
  SocketService,
  ThemeService,
  UploadService
} from './services';
import {LoginGuard} from './guards';
import {SimpleDialogComponent, DialogComponent} from "./components/dialog/";
import {FlexLayoutModule} from "@angular/flex-layout";

import {FileSizePipe} from "./utils/sizePipe";
import {RequestInterceptor} from "./services/request.interceptor";
import {OwlDateTimeModule, OwlNativeDateTimeModule} from "ng-pick-datetime";
import {PostComponent} from "./components/userApp";
import {SnackbarService} from "./services/snackbar.service";


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    BaseComponent,
    DashboardComponent,
    UploadComponent,
    ScheduleComponent,
    PostComponent,
    ViewLogComponent,
    SimpleDialogComponent,
    DialogComponent,
    FileSizePipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    ThemeService,
    LoginGuard,
    AuthService,
    UploadService,
    SchedulerService,
    LogsService,
    SocketService,
    DialogService,
    SnackbarService
  ],
  entryComponents: [ SimpleDialogComponent, DialogComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
