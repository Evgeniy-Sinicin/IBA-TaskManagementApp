import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { WEB_API_URL } from '../app-injection-tokens';
import { tap } from 'rxjs/operators'
import { Account } from '../models/account';

export const ACCOUNT = 'taskstore_account'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _http: HttpClient,
    @Inject(WEB_API_URL) private _apiUrl: string,
    private _jwtHelper: JwtHelperService,
    private _router: Router
  ) { }

  login(email: string, password: string): Observable<Account> {
    return this._http.post<Account>(`${this._apiUrl}api/auth/login`, { 
      email, 
      password 
    }).pipe(tap(user => {
      localStorage.setItem(ACCOUNT, JSON.stringify(user))
    }));
  }

  isAuthenticated(): boolean {
    var jsonAcc = localStorage.getItem(ACCOUNT)

    if (!jsonAcc) {
      return false
    }

    var acc = JSON.parse(jsonAcc) as Account

    if (!acc) {
      return false
    }

    return !this._jwtHelper.isTokenExpired(acc.token)
  }

  logout(): void {
    localStorage.removeItem(ACCOUNT)
    this._router.navigate([''])
  }
}
