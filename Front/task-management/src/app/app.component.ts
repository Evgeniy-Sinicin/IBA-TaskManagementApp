import { Component } from '@angular/core';
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
    private authService: AuthService,
    private accountService: AccountService
    ) { 
    this._isLoginButtonClicked = false;
    this._isRegisterButtonClicked = false;
  }

  public get isLoggedIn(): boolean {
    return this.authService.isAuthenticated()
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

  public clickLoginButton() {
    this._isLoginButtonClicked = !this._isLoginButtonClicked;
    this._isRegisterButtonClicked = false;
  }

  public clickRegisterButton() {
    this._isRegisterButtonClicked = !this._isRegisterButtonClicked;
    this._isLoginButtonClicked = false;
  }

  login(email: string, password: string) {
    this.authService.login(email, password)
    .subscribe(res => {

    }, error => {
      alert('! ! ! Wrong login or password ! ! !')
    })
  }

  logout() {
    this.authService.logout();
  }

  register(phone: string, email: string, password: string, confirmPassword: string) {
    this.accountService.register(phone, email, password, confirmPassword)
    .subscribe(res => {
      alert('Registration was successful :)')
    }, error => {
      alert('! ! ! Failed registration ! ! !')
      alert(console.log(error))
    })
  }
}
