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
import { HomeComponent } from './components/home/home.component';
import { OwnersComponent } from './components/owners/owners.component';
import { TasksComponent } from './components/tasks/tasks.component';
import { WEB_API_URL } from './app-injection-tokens';
import { environment } from 'src/environments/environment';

import { JwtModule } from '@auth0/angular-jwt'
import { ACCESS_TOKEN_KEY } from './services/auth.service';

export function tokenGetter() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    OwnersComponent,
    TasksComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,

    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,

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
