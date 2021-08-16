import { Component, OnInit, ViewChild } from '@angular/core'
import { CellClickEventArgs, CurrentAction, DragEventArgs, EJ2Instance, EventRenderedArgs, EventSettingsModel, ScheduleComponent, View } from '@syncfusion/ej2-angular-schedule'
import { interval } from 'rxjs'
import { TaskService } from 'src/app/services/task.service'
import { Task, Priority } from 'src/app/models/task'
import { emailGetter } from 'src/app/app.module'
import { isNullOrUndefined } from '@syncfusion/ej2-base'
import { L10n, Internationalization } from '@syncfusion/ej2-base'
import { TextBoxComponent } from '@syncfusion/ej2-angular-inputs'

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
  styleUrls: ['./scheduler.component.css'],
})
export class SchedulerComponent implements OnInit {

  private tempFinishDate!: Date

  startWeek: Number = 1
  tooltipTemplate: string = '' +
    '<div class="tooltip-wrapper">' +
    '<div class="tooltip-image-priority-${priority}"></div>' +
    '<div class="tooltip-content">' + 
    '<div class="tooltip-field">💬 Name:&nbsp;${name}</></div>' +
    '<div class="tooltip-field">📃 Desc:&nbsp;&nbsp;&nbsp;${description}</></div>' +
    '${if(priority == 0)}<div class="tooltip-field">⚡ Prior:&nbsp;&nbsp;&nbsp;Usual</div>${/if}' +
    '${if(priority == 1)}<div class="tooltip-field">⚡ Prior:&nbsp;&nbsp;&nbsp;Important</div>${/if}' +
    '${if(priority == 2)}<div class="tooltip-field">⚡ Prior:&nbsp;&nbsp;&nbsp;Critical</div>${/if}' +
    '<div class="tooltip-field">⌚ From:&nbsp;&nbsp;&nbsp;${startDate.toLocaleString()}</></div>' +
    '<div class="tooltip-field">🏁 To:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${finishDate.toLocaleString()}</></div>' +
    '${if(!isNeedNotify)}<div class="tooltip-field">🔕 Notify:&nbsp;No!</div>${/if}' +
    '${if(isNeedNotify)}<div class="tooltip-field">🔔 Notify:&nbsp;&nbsp;Yes!</div>${/if}' +
    '</div>' +
    '</div>'
  view: View = 'Month'
  views: View[] = ['Day', 'Week', 'Month', 'Year', 'Agenda']
  date: Date = new Date()
  intl: Internationalization = new Internationalization();
  priorityFields: Object = { text: 'PriorityText', value: 'PriorityText' }
  priorityData: Object[] = [
    { PriorityText: 'Usual', Id: 1 },
    { PriorityText: 'Important', Id: 2 },
    { PriorityText: 'Critical', Id: 3 }
  ]
  eventSettings: EventSettingsModel = {
    dataSource: [],
    fields: {
      subject: { name: 'name', title: 'Name' },
      description: { name: 'description', title: 'Description' },
      startTime: { name: 'startDate' },
      endTime: { name: 'finishDate', title: 'Finish Time' },
    },
    enableTooltip: true,
    ignoreWhitespace: true,
    tooltipTemplate: this.tooltipTemplate,
  }

  @ViewChild("scheduleObj") scheduleObj: ScheduleComponent;

  constructor(private _taskService: TaskService) {
    interval().subscribe(x => {
      this.date = new Date()
    })
  }

  ngOnInit(): void {
    this.refreshData()
  }

  onRenderTask(args: EventRenderedArgs) {
    if (!args.element || !args.data) {
      return
    }

    switch (args.data.priority) {
      case 1:
        args.element.classList.add('important')
        break;
      case 2:
        args.element.classList.add('critical')
        break;
      default:
        args.element.classList.add('usual')
        break;
    }
  }

  public buttonClickActions(e: Event) {
    const quickPopup: HTMLElement = this.scheduleObj.element.querySelector('.e-quick-popup-wrapper') as HTMLElement
    const getSlotData: Function = (): { [key: string]: Object } => {
      const cellDetails: CellClickEventArgs = this.scheduleObj.getCellDetails(this.scheduleObj.getSelectedElements())
      const addObj: { [key: string]: Object } = {}
      addObj.isNeedNotify = true
      addObj.priority = 0
      addObj.name = ((quickPopup.querySelector('#title') as EJ2Instance).ej2_instances[0] as TextBoxComponent).value;
      addObj.description = ((quickPopup.querySelector('#notes') as EJ2Instance).ej2_instances[0] as TextBoxComponent).value
      addObj.userEmail = emailGetter()
      addObj.startTime = new Date(+cellDetails.startTime)
      addObj.endTime = new Date(+cellDetails.endTime)
      this.tempFinishDate = new Date(+cellDetails.endTime)
      return addObj;
    };
    if ((e.target as HTMLElement).id === 'add') {
      const addObj: { [key: string]: Object } = getSlotData()
      this.scheduleObj.addEvent(addObj)
    } else if ((e.target as HTMLElement).id === 'delete') {
      const eventDetails: { [key: string]: Object } = this.scheduleObj.activeEventData.event as { [key: string]: Object }
      let currentAction: CurrentAction
      if (eventDetails.RecurrenceRule) {
        currentAction = 'DeleteOccurrence'
      }
      this.scheduleObj.deleteEvent(eventDetails, currentAction)
    } else {
      const isCellPopup: boolean = quickPopup.firstElementChild.classList.contains('e-cell-popup')
      const eventDetails: { [key: string]: Object } = isCellPopup ? getSlotData() :
        this.scheduleObj.activeEventData.event as { [key: string]: Object }
      let currentAction: CurrentAction = isCellPopup ? 'Add' : 'Save'
      if (eventDetails.RecurrenceRule) {
        currentAction = 'EditOccurrence'
      }
      this.scheduleObj.openEditor(eventDetails, currentAction, true);
    }
    this.scheduleObj.closeQuickInfoPopup();
  }

  getHeaderDetails(data) {
    return this.intl.formatDate(data.startDate, { type: 'date', skeleton: 'full' }) + ' (' +
      this.intl.formatDate(data.startDate, { skeleton: 'Hm' }) + ' - ' +
      this.intl.formatDate(data.finishDate, { skeleton: 'Hm' }) + ')';
  }

  getHeaderStyles(data: { [key: string]: Object }): Object {
    if (data.elementType === 'cell') {
      return { 'align-items': 'center', 'color': '#919191' };
    } else {
      switch (data.priority) {
        case 1:
          return { 'background': 'linear-gradient(90deg, gold, orange)', 'color': 'black' };
        case 2:
          return { 'background': 'linear-gradient(90deg, palevioletred, rgba(255, 0, 150, 0.5))', 'color': 'black' };
        default:
          return { 'background': 'linear-gradient(90deg, skyblue, deepskyblue)', 'color': 'black' };
      }

    }
  }

  onDragStop(args: DragEventArgs) {
    console.log('Info: On drag stop ...', args.data)
  }

  onResizeStop(args: DragEventArgs) {
    console.log('Info: On resize stop ...', args.data)
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
    task.priority = Number.isInteger(data.priority) ? data.priority : this.priorityToEnum(data.priority)
    task.name = data.name
    task.description = data.description
    task.userEmail = email
    task.startDate = isNullOrUndefined(data.startDate) ? new Date() : data.startDate
    task.finishDate = new Date(data.finishDate)

    console.log('Info: After creation ...', task)

    return task
  }

  addTask(task: Task) {
    console.log('Info: After creation ...', task)

    if (isNaN(task.finishDate.getTime())) {
      task.finishDate = this.tempFinishDate
    }

    this._taskService.addTask(task).subscribe(res => {
      console.log('Success: Task is created! 🥳')
      console.log('Info: Result 👇')
      console.log(res)

      this.refreshData()
    }, err => {
      console.log('Error: Task creation failed! 😥')
      console.log('Info: Error 👇')
      console.log(err)
    })
  }

  updateTask(task: Task) {
    this._taskService.updateTask(task).subscribe(res => {
      console.log('Success: Task is updated! 🥳')
      console.log('Info: Result 👇')
      console.log(res)

      this.refreshData()
    }, err => {
      console.log('Error: The task update failed! 😥')
      console.log('Info: Error 👇')
      console.log(err)
    })
  }

  deleteTask(task: Task) {
    this._taskService.deleteTask(task.id).subscribe(res => {
      console.log('Success: Task is deleted! 🥳')
      console.log('Info: Result 👇')
      console.log(res)

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
    this._taskService.getTasks().subscribe(data => {
      this.eventSettings = {
        dataSource: data,
        fields: {
          subject: { name: 'name', title: 'Name' },
          description: { name: 'description', title: 'Description' },
          startTime: { name: 'startDate' },
          endTime: { name: 'finishDate', title: 'Finish Time' },
        },
        enableTooltip: true,
        ignoreWhitespace: true,
        tooltipTemplate: this.tooltipTemplate,
      }
      console.log('Success: Data is loaded to scheduler 🥳')
    }, err => {
      console.log('Error: Fail to load data to scheduler 😥')
    })
  }
}
