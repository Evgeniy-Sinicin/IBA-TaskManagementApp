import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task'
import { AccountService } from 'src/app/services/account.service';
import { Account, Role } from 'src/app/models/account';
import { MatTableDataSource } from '@angular/material/table';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ThemePalette } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailGetter } from 'src/app/app.module';
import { AuthService } from 'src/app/services/auth.service';

export class AccountsTableCell {
  id: number
  email: string
  phone: string
  tasks: number
  usual: number
  important: number
  critical: number
  isAdmin: boolean
  isBlocked: boolean
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css'],
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
export class AdminPanelComponent implements OnInit {

  private _selectedUserEmail: string = undefined
  private _tasks: Task[] = []
  private _accounts: Account[] = []

  adminCount: number = 0
  blockedCount: number = 0
  emails: string[] = []
  date: Date = new Date()

  isLoading: boolean = false
  accountFilter: string = ''
  accountsTableColumns: string[] = ['id', 'email', 'phone', 'tasks', 'usual', 'important', 'critical', 'admin', 'blocked']
  expandedAccount!: Account
  accountsTableDataSource: MatTableDataSource<AccountsTableCell>
  adminToggleButtonColor: ThemePalette = 'primary'

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  accountsChartDatasets: Array<any> = [{
    data: [],
  }]

  accountsChartLabels: Array<any> = [
    'Users Count',
    'Admins Count',
    'Blocked Count'
  ]

  accountsChartColors: Array<any> = [
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
    { data: [], label: '' },
    { data: [], label: '' }
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
    data: [],
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
    private _authService: AuthService,
    private _snackBar: MatSnackBar,
  ) {

  }

  ngOnInit(): void {
    this.init()
  }

  async init() {
    await this._taskService.getAllTasks().subscribe(tasks => {
      this._tasks = tasks
      this.updateTasksChart(tasks)
      this.updateDatesChart(tasks)
      this.updateAverageTasksChart(tasks)
      this.updateAverageTasksDurationChart(tasks)
      this.updateAverageTasksOverdueChart(tasks)
    })

    await this._accountService.getAccounts().subscribe(accounts => {
      this.updateAccountsChart(accounts)
      this.refreshAccountsTable()
    })
  }

  changeRole(atc: AccountsTableCell) {
    if (atc.isBlocked) {
      return
    }

    this.isLoading = true

    let account = this._accounts.filter(a => a.id == atc.id)[0]
    let roles = account.roles

    if (roles.includes(Role.Admin)) {
      roles = roles.filter(r => r != Role.Admin)
    } else {
      roles.push(Role.Admin)
    }

    account.roles = roles

    this._accountService.updateAccount(account).subscribe(res => {
      this.isLoading = false

      if (roles.includes(Role.Admin)) {
        atc.isAdmin = true
        this._snackBar.open('Account has received Admin rights ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      } else {
        atc.isAdmin = false
        this._snackBar.open('Account has lost Admin rights ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      }

      if (account.email == emailGetter()) {
        this._authService.logout()
      } else {
        this.updateAccountsChart(this._accounts.filter(a => {
          if (a.id == account.id) {
            a.roles = roles
          }

          return a
        }))
      }

    }, err => {
      this.isLoading = false
      this._snackBar.open('Role changing is failed! 😢', undefined, { duration: 3000, verticalPosition: 'top' })
      console.log('Error: Role changing is failed! 😥 👇', err)
    })
  }

  changeBlockStatus(atc: AccountsTableCell) {
    this.isLoading = true

    let account = this._accounts.filter(a => a.id == atc.id)[0]
    let roles = account.roles

    if (roles.length != 0) {
      roles = []
    } else {
      roles.push(Role.User)
    }

    account.roles = roles

    this._accountService.updateAccount(account).subscribe(res => {
      this.isLoading = false

      if (roles.includes(Role.User)) {
        atc.isBlocked = false
        this._snackBar.open('Account has received User rights ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      } else {
        atc.isAdmin = false
        atc.isBlocked = true
        this._snackBar.open('Account is blocked ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      }

      if (account.email == emailGetter()) {
        this._authService.logout()
      } else {
        this.updateAccountsChart(this._accounts.filter(a => {
          if (a.id == account.id) {
            a.roles = roles
          }

          return a
        }))
      }
    }, err => {
      this.isLoading = false
      this._snackBar.open('Account blocking is failed! 😢', undefined, { duration: 3000, verticalPosition: 'top' })
      console.log('Error: Account blocking is failed! 😥 👇', err)
    })
  }

  refreshAccountsTable() {
    this.isLoading = true

    this.accountsTableDataSource = new MatTableDataSource(this.accounts.map(a => {
      return {
        id: a.id,
        email: a.email,
        phone: a.phone,
        tasks: this.getTasks(a.email).length,
        usual: this.getTasks(a.email, 0).length,
        important: this.getTasks(a.email, 1).length,
        critical: this.getTasks(a.email, 2).length,
        isAdmin: a.roles.includes(Role.Admin),
        isBlocked: a.roles.length == 0 ? true : false
      }
    }))

    this.accountsTableDataSource.paginator = this.paginator
    this.accountsTableDataSource.sort = this.sort
    this.isLoading = false
  }

  applyAccountFilter(event: Event) {
    this.accountFilter = (event.target as HTMLInputElement).value
    this.accountsTableDataSource.filter = this.accountFilter.trim().toLowerCase()

    if (this.accountsTableDataSource.paginator) {
      this.accountsTableDataSource.paginator.firstPage()
    }
  }

  getTasks(email: string, priority: number = -1) {
    if (priority == -1) {
      return this._tasks.filter(t => t.userEmail == email)
    }

    return this._tasks.filter(t => t.userEmail == email && t.priority == priority)
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
        (usualTasksCount / usualTasksUsers.size).toFixed(2),
        (importantTasksCount / importantTasksUsers.size).toFixed(2),
        (criticalTasksCount / criticalTasksUsers.size).toFixed(2),
        0,
        usualTasksCount / usualTasksUsers.size + importantTasksCount / importantTasksUsers.size + criticalTasksCount / criticalTasksUsers.size
      ],
      label: 'Average count of tasks by priority (all users)'
    }]
  }

  updateAccountsChart(accounts: Account[]) {
    this._accounts = accounts
    this.emails = accounts.map(a => a.email).sort()

    this.blockedCount = 0
    this.adminCount = 0

    accounts.forEach(a => {
      if (a.roles.length == 0) {
        this.blockedCount++
      } else if (a.roles.includes(1)) {
        this.adminCount++
      }
    })

    this.accountsChartDatasets = [{
      data: [
        this.accounts.length - this.adminCount - this.blockedCount,
        this.adminCount,
        this.blockedCount,
        0,
        this.accounts.length
      ],
      label: 'Accounts Count: ' + this.accounts.length
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
