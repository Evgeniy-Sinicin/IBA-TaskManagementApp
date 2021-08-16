import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task'
import { AccountService } from 'src/app/services/account.service';
import { Account } from 'src/app/models/account';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  private _selectedUserEmail: string = undefined
  private _tasks: Task[] = []
  private _accounts: Account[] = []

  adminCount: number = 0
  emails: string[] = []
  date: Date = new Date()

  accountsChartDatasets: Array<any> = [{
    data: [],
  }]

  accountsChartLabels: Array<any> = [
    'Users Count',
    'Admins Count'
  ]

  accountsChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255,99,132,1)',
      ],
      borderWidth: 2,
    }
  ]

  tasksChartDatasets: Array<any> = [{
    data: [],
  }]

  tasksChartLabels: Array<any> = [
    'Usual',
    'Important',
    'Critical'
  ]

  tasksChartColors: Array<any> = [
    {
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255,99,132,1)',
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderWidth: 2,
    }
  ]

  datesChartDatasets: Array<any> = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'My First dataset' },
    { data: [28, 48, 40, 19, 86, 27, 90], label: 'My Second dataset' }
  ];

  datesChartLabels: Array<any> = [...Array(32 - new Date(this.date.getFullYear(), this.date.getMonth(), 32).getDate())].map((e, i) => i + 1)

  datesChartColors: Array<any> = [
    {
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(255, 206, 86, 0.2)',
      borderColor: 'rgba(255, 206, 86, 1)',
      borderWidth: 2,
    },
    {
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255,99,132,1)',
      borderWidth: 2,
    }
  ];

  averageTasksChartDatasets: Array<any> = [{
    data: [3, 2, 1, 0],
  }]

  averageTasksChartLabels: Array<any> = [
    'Average Usual',
    'Average Important',
    'Average Critical',
  ]

  averageTasksChartColors: Array<any> = [
    {
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255,99,132,1)',
      ],
      borderWidth: 2,
    }
  ]

  averageTasksDurationChartDatasets: Array<any> = [{
    data: [],
  }]

  averageTasksDurationChartLabels: Array<any> = [
    'Usual',
    'Important',
    'Critical',
    'All',
  ]

  averageTasksDurationChartColors: Array<any> = [
    {
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255,99,132,1)',
      ],
      backgroundColor: [
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(255, 99, 132, 0.2)',
      ],
      borderWidth: 2,
    }
  ]

  averageTasksOverdueChartDatasets: Array<any> = [{
    data: [],
  }]

  chartOptions: any = {
    responsive: true,
  }

  get accounts() {
    return this._accounts
  }

  set selectedUserEmail(email: string) {
    this._selectedUserEmail = email
    let tasks = email == undefined ? this._tasks : this._tasks.filter(t => t.userEmail == email)
    this.updateTasksChart(tasks)
    this.updateDatesChart(tasks)
    this.updateAverageTasksDurationChart(tasks)
    this.updateAverageTasksOverdueChart(tasks)
  }

  constructor(
    private _accountService: AccountService,
    private _taskService: TaskService,
  ) {

  }

  ngOnInit(): void {
    this._taskService.getAllTasks().subscribe(tasks => {
      this._tasks = tasks
      this.updateTasksChart(tasks)
      this.updateDatesChart(tasks)
      this.updateAverageTasksChart(tasks)
      this.updateAverageTasksDurationChart(tasks)
      this.updateAverageTasksOverdueChart(tasks)
    })

    this._accountService.getAccounts().subscribe(accounts => {
      this._accounts = accounts
      this.emails = accounts.map(a => a.email).sort()

      accounts.forEach(a => {
        if (a.roles.includes(1)) {
          this.adminCount++
        }
      })

      this.accountsChartDatasets = [{
        data: [
          this.accounts.length - this.adminCount,
          this.adminCount,
          0,
          this.accounts.length
        ],
        label: 'Accounts Count: ' + this.accounts.length
      }]
    })
  }

  changeMonth(delta: number) {
    if (delta == 0) {
      this.date = new Date()
    } else {
      this.date.setMonth(this.date.getMonth() + delta)
    }

    let tasks = this._selectedUserEmail == undefined ? this._tasks : this._tasks.filter(t => t.userEmail == this._selectedUserEmail)
    console.log('SelectedUserEmail: ', this._selectedUserEmail)
    console.log('Tasks: ', tasks)
    this.updateDatesChart(tasks)
  }

  updateDatesChart(tasks: Task[]) {
    this.datesChartLabels = [...Array(32 - new Date(this.date.getFullYear(), this.date.getMonth(), 32).getDate())].map((e, i) => i + 1)

    let tasksCounts = [...Array(32 - new Date(this.date.getFullYear(), this.date.getMonth(), 32).getDate())].map((e, i) => 0)
    let usualTasksCounts = [...Array(32 - new Date(this.date.getFullYear(), this.date.getMonth(), 32).getDate())].map((e, i) => 0)
    let importantTasksCounts = [...Array(32 - new Date(this.date.getFullYear(), this.date.getMonth(), 32).getDate())].map((e, i) => 0)
    let criticalTasksCounts = [...Array(32 - new Date(this.date.getFullYear(), this.date.getMonth(), 32).getDate())].map((e, i) => 0)

    tasks.forEach(t => {
      let taskDate = new Date(t.startDate)

      if (taskDate.getFullYear() == this.date.getFullYear() &&
        taskDate.getMonth() == this.date.getMonth()) {
        tasksCounts[taskDate.getDate() - 1]++

        switch (t.priority) {
          case 1:
            importantTasksCounts[taskDate.getDate() - 1]++
            break;
          case 2:
            criticalTasksCounts[taskDate.getDate() - 1]++
            break;
          default:
            usualTasksCounts[taskDate.getDate() - 1]++
            break;
        }
      }
    })

    this.datesChartDatasets = [
      {
        data: tasksCounts,
        label: 'Task Count: ' + tasksCounts.reduce((prev, i) => prev + i)
      },
      {
        data: usualTasksCounts,
        label: 'Usual Task Count: ' + usualTasksCounts.reduce((prev, i) => prev + i)
      },
      {
        data: importantTasksCounts,
        label: 'Important Task Count: ' + importantTasksCounts.reduce((prev, i) => prev + i)
      },
      {
        data: criticalTasksCounts,
        label: 'Critical Task Count: ' + criticalTasksCounts.reduce((prev, i) => prev + i)
      }
    ]
  }

  updateAverageTasksChart(tasks: Task[]) {
    let usualTasksUsers = new Set()
    let importantTasksUsers = new Set()
    let criticalTasksUsers = new Set()

    let usualTasksCount = 0
    let importantTasksCount = 0
    let criticalTasksCount = 0

    tasks.forEach(t => {
      switch (t.priority) {
        case 1:
          importantTasksCount++
          importantTasksUsers.add(t.userEmail)
          break;
        case 2:
          criticalTasksCount++
          criticalTasksUsers.add(t.userEmail)
          break;
        default:
          usualTasksCount++
          usualTasksUsers.add(t.userEmail)
          break;
      }
    })

    this.averageTasksChartDatasets = [{
      data: [
        usualTasksCount / usualTasksUsers.size,
        importantTasksCount / importantTasksUsers.size,
        criticalTasksCount / criticalTasksUsers.size,
        0,
        usualTasksCount / usualTasksUsers.size + importantTasksCount / importantTasksUsers.size + criticalTasksCount / criticalTasksUsers.size
      ],
      label: 'Average count of tasks by priority (all users)'
    }]
  }

  updateTasksChart(tasks: Task[]) {
    let usualTasksCount = 0
    let importantTasksCount = 0
    let criticalTasksCount = 0

    tasks.forEach(t => {
      switch (t.priority) {
        case 1:
          importantTasksCount++
          break;
        case 2:
          criticalTasksCount++
          break;
        default:
          usualTasksCount++
          break;
      }
    })

    this.tasksChartDatasets = [{
      data: [
        usualTasksCount,
        importantTasksCount,
        criticalTasksCount
      ],
      label: 'Tasks Count: ' + tasks.length
    }]
  }

  updateAverageTasksDurationChart(tasks: Task[]) {
    let averageDuration = 0
    let averageDurationUsual = 0
    let averageDurationImportant = 0
    let averageDurationCritical = 0

    let usualTasksCount = 0
    let importantTasksCount = 0
    let criticalTasksCount = 0

    tasks.forEach(t => {
      let diffMs = new Date(t.finishDate).getTime() - new Date(t.startDate).getTime()

      if (diffMs < 0) {
        return
      }

      let diffHours = diffMs / 1000 / 60 / 60

      averageDuration += diffHours

      switch (t.priority) {
        case 1:
          averageDurationImportant += diffHours
          importantTasksCount++
          break;
        case 2:
          averageDurationCritical += diffHours
          criticalTasksCount++
          break;
        default:
          averageDurationUsual += diffHours
          usualTasksCount++
          break;
      }
    })

    this.averageTasksDurationChartDatasets = [{
      data: [
        (averageDurationUsual / usualTasksCount).toFixed(2),
        (averageDurationImportant / importantTasksCount).toFixed(2),
        (averageDurationCritical / criticalTasksCount).toFixed(2),
        (averageDuration / tasks.length).toFixed(2)
      ],
      label: 'Average Tasks Duration Time'
    }]
  }

  updateAverageTasksOverdueChart(tasks: Task[]) {
    let averageOverdue = 0
    let averageOverdueUsual = 0
    let averageOverdueImportant = 0
    let averageOverdueCritical = 0

    let usualTasksCount = 0
    let importantTasksCount = 0
    let criticalTasksCount = 0

    tasks.forEach(t => {
      let diffMs = new Date(t.finishDate).getTime() - new Date(this.date).getTime()

      if (diffMs > 0) {
        return
      }

      let diffHours = diffMs / 1000 / 60 / 60

      averageOverdue += diffHours

      switch (t.priority) {
        case 1:
          averageOverdueImportant += diffHours
          importantTasksCount++
          break;
        case 2:
          averageOverdueCritical += diffHours
          criticalTasksCount++
          break;
        default:
          averageOverdueUsual += diffHours
          usualTasksCount++
          break;
      }
    })

    this.averageTasksOverdueChartDatasets = [{
      data: [
        -(averageOverdueUsual / usualTasksCount).toFixed(2),
        -(averageOverdueImportant / importantTasksCount).toFixed(2),
        -(averageOverdueCritical / criticalTasksCount).toFixed(2),
        -(averageOverdue / tasks.length).toFixed(2)
      ],
      label: 'Average Overdue Tasks Time'
    }]
  }
}
