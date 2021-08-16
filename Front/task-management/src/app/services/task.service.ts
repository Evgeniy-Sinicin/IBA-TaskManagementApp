import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
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
    ) { }

    getAllTasks(): Observable<Task[]> {
      return this._http.get<Task[]>(`${this._apiUrl}api/tasks/all`)
    }

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
