import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EmailErrorStateMatcher } from 'src/app/error-state-matchers/email-error-state-matcher';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormGroup: FormGroup
  emailMatcher = new EmailErrorStateMatcher()
  isPasswordHidden = true
  isLoading = false

  get emailCtrl() {
    return this.loginFormGroup.controls.emailCtrl as FormControl
  }

  constructor(
    private _authService: AuthService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
  ) {
    this.loginFormGroup = this._formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email]],
      passwordCtrl: ['', Validators.required],
    })
  }

  ngOnInit(): void { }

  clickLoginButton() {
    this.isLoading = true
    this._authService.login(
      this.loginFormGroup.controls.emailCtrl.value,
      this.loginFormGroup.controls.passwordCtrl.value)
      .subscribe(res => {
        this.isLoading = false
        this._router.navigate(['/'])
        this._snackBar.open('Authorization is successful ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
      }, error => {
        this.isLoading = false
        this.loginFormGroup.reset()
        this._snackBar.open('Authorization is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
      })
  }
}
