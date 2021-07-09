import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AccountService } from 'src/app/services/account.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { EmailErrorStateMatcher } from 'src/app/error-state-matchers/email-error-state-matcher';
import { PasswordErrorStateMatcher } from 'src/app/error-state-matchers/password-error-state-matcher';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class SignupComponent implements OnInit {
  phoneFormGroup: FormGroup
  emailFormGroup: FormGroup
  passwordFormGroup: FormGroup
  emailMatcher = new EmailErrorStateMatcher()
  passwordMatcher = new PasswordErrorStateMatcher()
  isPasswordHidden = true
  isPasswordConfirgHidden = true

  @ViewChild('stepper')
  private _stepper!: MatStepper;

  get phoneCtrl() {
    return this.phoneFormGroup.controls.phoneCtrl as FormControl
  }

  get emailCtrl() {
    return this.emailFormGroup.controls.emailCtrl as FormControl
  }

  constructor(
    private _accountService: AccountService,
    private _router: Router,
    private _snackBar: MatSnackBar,
    private _formBuilder: FormBuilder
  ) {
    this.phoneFormGroup = this._formBuilder.group({
      phoneCtrl: ['', [Validators.required, Validators.pattern('^([0|\+[0-9]{13})$')]]
    })
    this.emailFormGroup = this._formBuilder.group({
      emailCtrl: ['', [Validators.required, Validators.email]]
    })
    this.passwordFormGroup = this._formBuilder.group({
      passwordCtrl: ['', Validators.required],
      passwordConfirm: ['']
    }, {
      validator: this.checkPasswords
    })
  }

  ngOnInit(): void { }

  checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    let pass = group.controls.passwordCtrl.value
    let passConfirm = group.controls.passwordConfirm.value

    return pass === passConfirm ? null : { notSame: true }
  }

  clickSignUpButton() {
    this._accountService.register(
    this.phoneCtrl.value,
    this.emailCtrl.value,
    this.passwordFormGroup.controls.passwordCtrl.value,
    this.passwordFormGroup.controls.passwordCtrl.value)
    .subscribe(res => {
      this._router.navigate(['login'])
      this._snackBar.open('Registration is successful ✔ 🥳 🎈', undefined, { duration: 3000, verticalPosition: 'top' })
    }, error => {
      this._stepper.reset()
      this._snackBar.open('Registration is failed 😢', undefined, { duration: 3000, verticalPosition: 'top' })
    })
  }
}