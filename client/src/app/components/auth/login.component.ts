import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService, DialogService} from "../../services";
import {Router} from "@angular/router";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-auth',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  // MARK: Properties
  myform: FormGroup;
  isLoading = false;

  private dialogData = {title: 'Invalid Credentials',
    message: 'The key&username combination entered is not valid.Please try again.'};

  // MARK: Initialization
  constructor(private authService: AuthService,
              private dialogService: DialogService,
              private router: Router) {}

  ngOnInit() {
    this.myform = new FormGroup({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
    AuthService.logOut();
  }

  // MARK: Public methods
  public login() {
    this.isLoading = true;
    const account = {username: this.myform.get('email').value,
                      postKey: this.myform.get('password').value, publicKey: ''};
    this.authService.logIn(account)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe( () => this.router.navigate(['app']),
        (err) => this.dialogService.showSimpleDialogWith(this.dialogData));
  }

  public getErrorMessage() {
    return this.myform.get('email').hasError('required') ? 'You must enter a value' :
      this.myform.get('email').hasError('email') ? 'Not a valid email' : '';
  }
}

