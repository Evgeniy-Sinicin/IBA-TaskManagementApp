import { animate, state, style, transition, trigger } from '@angular/animations'
import { DatePipe } from '@angular/common'
import { AfterViewInit, ViewChild } from '@angular/core'
import { Component, OnInit } from '@angular/core'
import { MatDialog } from '@angular/material/dialog'
import { MatPaginator } from '@angular/material/paginator'
import { MatSnackBar } from '@angular/material/snack-bar'
import { MatSort } from '@angular/material/sort'
import { MatTableDataSource } from '@angular/material/table'
import { interval } from 'rxjs'
import { AuthService } from 'src/app/services/auth.service'
import { TaskService } from 'src/app/services/task.service'
import { __decorate } from 'tslib'
import { Priority, Task } from '../../models/task'
import { AddingTaskDialogComponent } from '../adding-task-dialog/adding-task-dialog.component'
import { UpdateTaskDialogComponent } from '../update-task-dialog/update-task-dialog.component'

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void',
        style({ height: '0px' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])]
})
export class TasksComponent {

  date: Date = new Date()

  displayedColumns: string[] = ['id', 'status', 'priority', 'name', 'description', 'userEmail', 'finishDate']
  dataSource!: MatTableDataSource<Task>
  expandedElement!: Task
  isLoading!: boolean

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _taskService: TaskService,
    private _snackBar: MatSnackBar,
    private _dialog: MatDialog,
    private _datePipe: DatePipe,
  ) {
    this.refreshTable()

    interval(1000).subscribe(res => {
      this.date = new Date()
    })
  }

  Date(date: string): string {
    return new Date(date).toLocaleString()
  }

  Priority(priority: string): string {
    return Priority[Number(priority)]
  }

  changeNotificationStatus(task: Task) {
    task.isNeedNotify = !task.isNeedNotify

    this.isLoading = true
    this._taskService.updateTask(task).subscribe(res => {
      this.isLoading = false
      if (task.isNeedNotify) {
        this._snackBar.open('Subscribed successfully ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      }
      else {
        this._snackBar.open('Unsubscribed successfully ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      }
      this.refreshTable()
    }, error => {
      this.isLoading = false
      this._snackBar.open('Task update is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
    })
  }

  isOverdue(task: Task) {
    if (new Date(task.finishDate).getTime() - this.date.getTime() <= 0) {
      return true
    }

    return false
  }

  getDifference(task: Task): string {
    var time = new Date(task.finishDate).getTime() - this.date.getTime()
    var days = Math.floor(time / (1000 * 60 * 60 * 24))

    if (days < 0) {
      days++
    }

    var hours = Math.floor((time - (1000 * 60 * 60 * 24 * days)) / 60 / 60 / 1000) % 24

    if (hours < 0) {
      hours++
    }

    var minutes = Math.floor((time - (1000 * 60 * 60 * 24 * days)) / 60 / 1000) % 60

    if (minutes < 0) {
      minutes++
    }

    var seconds = Math.floor((time - (1000 * 60 * 60 * 24 * days)) / 1000) % 60

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`
  }

  refreshTable() {
    this.isLoading = true
    this._taskService.getTasks().subscribe(res => {
      this.isLoading = false
      this.dataSource = new MatTableDataSource(res)
      this.dataSource.sort = this.sort
      this.dataSource.paginator = this.paginator

      // console.log('Difference: ', this._datePipe.transform(new Date(new Date().valueOf() - new Date().valueOf()), 'dd/MM/yyyy hh:mm:ss'))
    }, error => {
      this.isLoading = false
      this._snackBar.open('Table refreshing is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
    })
  }

  openUpdateDialog(task: Task) {
    const dialogRef = this._dialog.open(UpdateTaskDialogComponent, {
      data: task
    })

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true
        this._taskService.updateTask(result).subscribe(res => {
          this.isLoading = false
          this._snackBar.open('Task is updated successfully ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
          this.refreshTable()
        }, error => {
          this.isLoading = false
          this._snackBar.open('Task update is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
        })
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
    this.dataSource.filter = filterValue.trim().toLowerCase()

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage()
    }
  }

  openAddingDialog() {
    const dialogRef = this._dialog.open(AddingTaskDialogComponent)

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.isLoading = true
        this._taskService.addTask(result).subscribe(res => {
          this.isLoading = false
          this._snackBar.open('Task is added successfully ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
          this.refreshTable()
        }, error => {
          this.isLoading = false
          this._snackBar.open('Task adding is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
        })
      }
    })
  }

  clickDeleteButton(task: Task) {
    if (task) {
      this.isLoading = true
      this._taskService.deleteTask(task.id).subscribe(res => {
        this.isLoading = false
        this._snackBar.open('Task is deleted successfully ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
        this.refreshTable()
      }, error => {
        this.isLoading = false
        this._snackBar.open('Task deleting is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
      })
    }
  }
}