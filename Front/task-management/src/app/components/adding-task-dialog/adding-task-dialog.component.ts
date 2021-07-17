import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { emailGetter } from 'src/app/app.module';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-adding-task-dialog',
  templateUrl: './adding-task-dialog.component.html',
  styleUrls: ['./adding-task-dialog.component.css']
})
export class AddingTaskDialogComponent implements OnInit {

  taskFormGroup: FormGroup

  get nameCtrl() {
    return this.taskFormGroup.controls.nameCtrl as FormControl
  }

  constructor(
    public dialogRef: MatDialogRef<AddingTaskDialogComponent>,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    ) { 
      this.taskFormGroup = this._formBuilder.group({
        nameCtrl: ['', [Validators.required]],
        descriptionCtrl: ['',],
      })
    }

  ngOnInit(): void { }

  clickAddButton() {
    if (!this.taskFormGroup.valid) {
      this._snackBar.open('Please, enter task name ❗', undefined, { duration: 3000, verticalPosition: 'top' })
      return
    }

    let email = emailGetter()
    if (!email) {
      this._snackBar.open('Service failed to identify you 😢', undefined, { duration: 3000, verticalPosition: 'top' })
      return
    } 

    var task = new Task()
    task.name = this.taskFormGroup.controls.nameCtrl.value
    task.description = this.taskFormGroup.controls.descriptionCtrl.value
    task.userEmail = email
    this.dialogRef.close(task)
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
