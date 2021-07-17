import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { WEB_API_URL } from '../app-injection-tokens';
import { Task } from '../models/task'

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private _http: HttpClient,
    @Inject(WEB_API_URL) private _apiUrl: string,
    private _jwtHelper: JwtHelperService,
    private _router: Router
    ) { }

    getTasks(): Observable<Task[]> {
      return this._http.get<Task[]>(`${this._apiUrl}api/tasks`)
    }

    addTask(task: Task): Observable<unknown> {
      return this._http.put<Task>(`${this._apiUrl}api/tasks`, task)
    }

    updateTask(task: Task): Observable<unknown> {
      return this._http.post<Task>(`${this._apiUrl}api/tasks`, task)
    }

    deleteTask(id: string): Observable<unknown> {
      return this._http.delete(`${this._apiUrl}api/tasks/${id}`)
    }
}
