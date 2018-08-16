import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../services';
import {Injectable} from "@angular/core";

@Injectable()
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  async canActivate() {
    try {
      if (localStorage) {
        if (localStorage.getItem('token') !== null) {
          if (localStorage.getItem('token') !== undefined) {
            return true;
          }
        }
      }
    } catch (err) { this.router.navigate(['/']); }
  }
}
