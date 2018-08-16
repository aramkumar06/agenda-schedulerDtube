import {Component, HostListener} from '@angular/core';
import {AuthService, MaterialTheme, ThemeService, UploadService} from '../../../services';
import {Account} from '../../../models';

@Component({
  selector: 'app-bot-app',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.scss']
})
export class BaseComponent {
  // MARK: Properties
  themes = [
    { 'title': 'Dark', 'value': MaterialTheme.dark},
    { 'title': 'Light', 'value': MaterialTheme.light}];

  account: Account;
  user;

  // MARK: Initialization
  constructor(private themeService: ThemeService,
              private uploadService: UploadService,
              private authService: AuthService) {
    authService.$acc.subscribe((account) => this.account = account);
  }

  // MARK: Public methods
  public changeTheme(theme: MaterialTheme) {
    this.themeService.changeThemeTo(theme);
  }

  // MARK: Listeners
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.uploadService.isUploading()) $event.returnValue = true;
  }
}
