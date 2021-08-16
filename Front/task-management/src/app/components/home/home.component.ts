import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Account, Role } from 'src/app/models/account';
import { ACCOUNT, AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public get user(): Account | null {
    var jsonAcc = localStorage.getItem(ACCOUNT)

    if (jsonAcc) {
      return JSON.parse(jsonAcc) as Account
    }

    return null
  }

  public get isLoggedIn(): boolean {
    return this._authService.isAuthenticated()
  }

  constructor(
    private _router: Router,
    private _authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  clickTasksButton() {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['tasks'])
    }
  }

  clickSchedulerButton() {
    if (this._authService.isAuthenticated()) {
      this._router.navigate(['scheduler'])
    }
  }

  getRoleName(value: number): string {
    return Role[value]
  }

  clickLoginButton() {
    this._router.navigate(['login'])
  }

  clickSignUpButton() {
    this._router.navigate(['signup'])
  }

  clickAdminPanelButton() {
    this._router.navigate(['admin-panel'])
  }

  isAdmin(): boolean {
    this.user.roles.forEach(r => {
      console.log(r)
    })

    return true
  }
}