import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSortModule } from '@angular/material/sort';

import { HomeComponent } from './components/home/home.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { WEB_API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { JwtModule } from '@auth0/angular-jwt'
import { ACCOUNT } from './services/auth.service';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { Account } from './models/account';
import { AddingTaskDialogComponent } from './components/adding-task-dialog/adding-task-dialog.component';
import { UpdateTaskDialogComponent } from './components/update-task-dialog/update-task-dialog.component';

export function tokenGetter() {
  var jsonAcc = localStorage.getItem(ACCOUNT)

  if (!jsonAcc) {
    return null
  }

  var acc = JSON.parse(jsonAcc) as Account

  if (!acc) {
    return null
  }

  return acc.token
}

export function emailGetter() {
  var jsonAcc = localStorage.getItem(ACCOUNT)

  if (!jsonAcc) {
    return null
  }

  var acc = JSON.parse(jsonAcc) as Account

  if (!acc) {
    return null
  }

  return acc.email
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    TasksComponent,
    LoginComponent,
    SignupComponent,
    AddingTaskDialogComponent,
    UpdateTaskDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatSnackBarModule,
    MatStepperModule,
    MatDividerModule,
    MatProgressBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,

    JwtModule.forRoot({
      config: {
        tokenGetter,
        allowedDomains: [environment.tokenWhiteListedDomains]
      }
    })
  ],
  providers: [{
    provide: WEB_API_URL,
    useValue: environment.webApi
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
