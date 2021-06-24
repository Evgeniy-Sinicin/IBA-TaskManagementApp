import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WEB_API_URL } from '../app-injection-tokens';

@Injectable({
  providedIn: 'root'
})
export class TaskstoreService {

  constructor(private http: HttpClient, @Inject(WEB_API_URL) private apiUrl: string) {

  }

  private baseApiUrl = `${this.apiUrl}api/`;
  
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseApiUrl}tasks`)
  }

  getOwners(): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.baseApiUrl}owners`)
  }
}
