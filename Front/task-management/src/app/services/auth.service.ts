import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { WEB_API_URL } from '../app-injection-tokens';
import { Token } from '../models/token';
import { tap } from 'rxjs/operators'

export const ACCESS_TOKEN_KEY = 'taskstore_access_token'

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
    @Inject(WEB_API_URL) private apiUrl: string,
    private jwtHelper: JwtHelperService,
    private router: Router
  ) { }

  login(email: string, password: string): Observable<Token> {
    return this.http.post<Token>(`${this.apiUrl}api/auth/login`, { 
      email, 
      password 
    }).pipe(tap(token => {
      localStorage.setItem(ACCESS_TOKEN_KEY, token.access_token);
    }));
  }

  isAuthenticated(): boolean {
    var token = localStorage.getItem(ACCESS_TOKEN_KEY);

    if (token != null)
    {
      return !this.jwtHelper.isTokenExpired(token)
    }
    
    return false
  }

  logout(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    this.router.navigate(['']);
  }
}
