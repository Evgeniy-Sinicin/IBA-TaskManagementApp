import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Task } from 'src/app/models/task';

@Component({
  selector: 'app-update-task-dialog',
  templateUrl: './update-task-dialog.component.html',
  styleUrls: ['./update-task-dialog.component.css']
})
export class UpdateTaskDialogComponent implements OnInit {

  taskFormGroup: FormGroup

  get nameCtrl() {
    return this.taskFormGroup.controls.nameCtrl as FormControl
  }

  constructor(
    public dialogRef: MatDialogRef<UpdateTaskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Task,
    private _formBuilder: FormBuilder,
    private _snackBar: MatSnackBar,
    ) { 
      this.taskFormGroup = this._formBuilder.group({
        nameCtrl: ['', [Validators.required]],
        descriptionCtrl: ['',],
      })
    }

  ngOnInit(): void { }

  clickEditButton() {
    if (!this.taskFormGroup.valid) {
      this._snackBar.open('Please, enter task name ❗', undefined, { duration: 3000, verticalPosition: 'top' })
      return
    }

    var task = new Task()
    task.id = this.data.id
    task.name = this.taskFormGroup.controls.nameCtrl.value
    task.description = this.taskFormGroup.controls.descriptionCtrl.value
    task.userEmail = this.data.userEmail
    this.dialogRef.close(task)
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
