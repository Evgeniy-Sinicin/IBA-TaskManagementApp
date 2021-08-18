import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_API_URL } from '../app-injection-tokens';
import { Account } from '../models/account';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private _http: HttpClient,
    @Inject(WEB_API_URL) private _apiUrl: string,
  ) { }

  register(phone: string, email: string, password: string, passwordConfirm: string): Observable<unknown> {
    return this._http.put<unknown>(`${this._apiUrl}api/auth/register`, {
      phone,
      email,
      password,
      passwordConfirm
    })
  }
  
  getAccounts() {
    return this._http.get<Account[]>(`${this._apiUrl}api/auth/users`)
  }

  updateAccount(account: Account): Observable<Account> {
    return this._http.post<Account>(`${this._apiUrl}api/auth/users`, account)
  }
}
