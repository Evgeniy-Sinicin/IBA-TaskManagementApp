import { Component, OnInit, ViewChild } from '@angular/core'
import { DragEventArgs, EventSettingsModel, ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule'
import { interval } from 'rxjs'
import { TaskService } from 'src/app/services/task.service'
import { Task, Priority } from 'src/app/models/task'
import { emailGetter } from 'src/app/app.module'
import { isNullOrUndefined } from '@syncfusion/ej2-base'
import { L10n } from '@syncfusion/ej2-base'

L10n.load({
  'en-US': {
    'schedule': {
      'saveButton': 'Add ✔',
      'cancelButton': 'Close ❌',
      'deleteButton': 'Delete 🔥',
      'newEvent': 'Task Createor ✨',
      'editEvent': 'Task Editor 📝',
    }
  }
})

@Component({
  selector: 'app-scheduler',
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.css']
})
export class SchedulerComponent implements OnInit {

  val: boolean = false
  startWeek: Number = 1
  view: View = 'Month'
  views: View[] = ['Day', 'Week', 'Month', 'Year', 'Agenda']
  tasks: Task[]
  date: Date = new Date()
  priorityFields: Object = { text: 'PriorityText', value: 'PriorityText' };
  priorityData: Object[] = [
    { PriorityText: 'Usual', Id: 1 },
    { PriorityText: 'Important', Id: 2 },
    { PriorityText: 'Critical', Id: 3 }
  ]
  eventSettings: EventSettingsModel = {
    fields: {
      subject: { name: 'name', title: 'Name' },
      description: { name: 'description', title: 'Description' },
      startTime: { name: 'startDate' },
      endTime: { name: 'finishDate', title: 'Finish Time' },
    },
    enableTooltip: true,
  }

  @ViewChild("scheduleObj") scheduleObj: ScheduleComponent;

  constructor(private _taskService: TaskService) {
    interval().subscribe(x => {
      this.date = new Date()
    })
  }

  ngOnInit(): void {
    this._taskService.getTasks().subscribe(res => {
      this.tasks = res
      this.eventSettings = {
        dataSource: this.tasks
      }

      console.log('Success: Data is loaded to scheduler 🥳')
    }, err => {
      console.log('Error: Fail to load data to scheduler 😥')
    })
  }

  onDragStop(args: DragEventArgs) {
    console.log('On drag stop ...', args.data)
  }

  onResizeStop(args: DragEventArgs) {
    console.log('On resize stop ...', args.data)
  }

  onActionComplete(args) {
    if (args.requestType !== 'eventCreated' &&
      args.requestType !== 'eventChanged' &&
      args.requestType !== 'eventRemoved') {
      return
    }

    if (isNullOrUndefined(args.data[0])) {
      return
    }

    let task = this.createTask(args.data[0])

    if (isNullOrUndefined(task)) {
      console.log('Error: Creation task failed! 😥')
      return
    }

    if (args.requestType === 'eventCreated') {
      this.addTask(task)
    } else if (args.requestType === 'eventChanged') {
      this.updateTask(task)
    } else if (args.requestType === 'eventRemoved') {
      this.deleteTask(task)
    }
  }

  createTask(data: any): Task {
    console.log('Info: Before creation ...', data)

    let email = emailGetter()
    if (!email) {
      // this._snackBar.open('Service failed to identify you 😢', undefined, { duration: 3000, verticalPosition: 'top' })
      console.log('Error: Service failed to identify you! 😢')
      return null
    }

    let task = new Task()
    task.id = data.id
    task.isNeedNotify = data.isNeedNotify
    task.priority = this.priorityToEnum(data.priority)
    task.name = data.name
    task.description = data.description
    task.userEmail = email
    task.startDate = isNullOrUndefined(data.startDate) ? new Date() : data.startDate
    task.finishDate = new Date(data.finishDate)

    return task
  }

  addTask(task: Task) {
    console.log('Info: After creation ...', task)

    this._taskService.addTask(task).subscribe(res => {
      console.log('Success: Task is created! 🥳')
      console.log('Info: Result 👇')
      console.log(res)

      this.tasks.push(task)
      this.refreshData()
    }, err => {
      console.log('Error: Task creation failed! 😥')
      console.log('Info: Error 👇')
      console.log(err)
    })
  }

  updateTask(task: Task) {
    console.log('Info: After the update ...', task)

    this._taskService.updateTask(task).subscribe(res => {
      console.log('Success: Task is updated! 🥳')
      console.log('Info: Result 👇')
      console.log(res)

      this.tasks.find(t => {
        if (t.id == task.id) {
          t.name = task.name
          t.description = task.description
          t.priority = task.priority
          t.isNeedNotify = task.isNeedNotify
          t.finishDate = task.finishDate
        }
      })

      this.refreshData()
      this.scheduleObj.refreshEvents()
    }, err => {
      console.log('Error: The task update failed! 😥')
      console.log('Info: Error 👇')
      console.log(err)
    })
  }

  deleteTask(task: Task) {
    console.log('Info: After deleting ...', task)

    this._taskService.deleteTask(task.id).subscribe(res => {
      console.log('Success: Task is deleted! 🥳')
      console.log('Info: Result 👇')
      console.log(res)

      this.tasks = this.tasks.filter(t => t.id != task.id)
      this.refreshData()
    }, err => {
      console.log('Error: The task deleting failed! 😥')
      console.log('Info: Error 👇')
      console.log(err)
    })
  }

  priority(priority: string): string {
    return Priority[Number(priority)]
  }

  priorityToEnum(priority: string) {
    switch (priority) {
      case "Important":
        return Priority.Important
      case "Critical":
        return Priority.Critical
      default:
        return Priority.Usual
    }
  }

  refreshData() {
    this.eventSettings = {
      dataSource: this.tasks,
      fields: {
        subject: { name: 'name', title: 'Name' },
        description: { name: 'description', title: 'Description' },
        startTime: { name: 'startDate' },
        endTime: { name: 'finishDate', title: 'Finish Time' },
      },
      enableTooltip: true,
    }
  }

  insertCellImage(data: any) {
    console.log(this.tasks)

    // this._taskService.getTasks().subscribe(tasks => {
    //   tasks.forEach(t => {
    //     if (t.finishDate == new Date(data)) {
    //       console.log(data)
    //     }
    //   })
    // })
  }
}
