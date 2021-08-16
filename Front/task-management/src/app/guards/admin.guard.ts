import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Account, Role } from '../models/account';
import { ACCOUNT, AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private _authService: AuthService,
    private _router: Router) {

  }

  canActivate(): boolean {
    if (!this._authService.isAuthenticated()) {
      this._router.navigate([''])
    }

    var acc = JSON.parse(localStorage.getItem(ACCOUNT)) as Account

    if (!acc) {
      this._router.navigate([''])
    }

    if (!acc.roles.includes(Role.Admin)) {
      this._router.navigate([''])
    }

    return true;
  }
  
}
