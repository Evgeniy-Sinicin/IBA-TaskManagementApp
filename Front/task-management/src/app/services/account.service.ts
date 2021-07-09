import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler/src/ml_parser/lexer';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { WEB_API_URL } from '../app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private http: HttpClient,
    @Inject(WEB_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router,
  ) { }

  register(phone: string, email: string, password: string, passwordConfirm: string): Observable<unknown> {
    return this.http.put<unknown>(`${this.apiUrl}api/auth/register`, {
      phone,
      email,
      password,
      passwordConfirm
    });
  }
  
}
