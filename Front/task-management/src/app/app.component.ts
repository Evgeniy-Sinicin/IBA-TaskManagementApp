import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { AccountService } from './services/account.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private _isLoginButtonClicked: boolean;
  private _isRegisterButtonClicked: boolean;

  constructor(
    private _authService: AuthService,
    private _accountService: AccountService,
    private _router: Router,
    public datePipe: DatePipe
    ) { 
    this._isLoginButtonClicked = false;
    this._isRegisterButtonClicked = false;
  }

  public get date(): number {
    return Date.now()
  }

  public get isLoggedIn(): boolean {
    return this._authService.isAuthenticated()
  }

  public get isLoginButtonClicked(): boolean {
    return this._isLoginButtonClicked
  }

  public set isLoginButtonClicked(value: boolean) {
    this._isLoginButtonClicked = value;
  }

  public get isRegisterButtonClicked(): boolean {
    return this._isRegisterButtonClicked
  }

  public set isRegisterButtonClicked(value: boolean) {
    this._isRegisterButtonClicked = value;
  }

  public clickHomeButton() {
    this._router.navigate(['/'])
  }

  public clickLoginButton() {
    this._isLoginButtonClicked = !this._isLoginButtonClicked;
    this._isRegisterButtonClicked = false;
  }

  public clickRegisterButton() {
    this._isRegisterButtonClicked = !this._isRegisterButtonClicked;
    this._isLoginButtonClicked = false;
  }

  login(email: string, password: string) {
    this._authService.login(email, password)
    .subscribe(res => {

    }, error => {
      alert('! ! ! Wrong login or password ! ! !')
    })
  }

  logout() {
    this._authService.logout();
  }

  register(phone: string, email: string, password: string, confirmPassword: string) {
    this._accountService.register(phone, email, password, confirmPassword)
    .subscribe(res => {
      alert('Registration was successful :)')
    }, error => {
      alert('! ! ! Failed registration ! ! !')
      alert(console.log(error))
    })
  }
}
