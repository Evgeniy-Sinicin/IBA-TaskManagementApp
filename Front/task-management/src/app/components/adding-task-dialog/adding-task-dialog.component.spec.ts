import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddingTaskDialogComponent } from './adding-task-dialog.component';

describe('AddingTaskDialogComponent', () => {
  let component: AddingTaskDialogComponent;
  let fixture: ComponentFixture<AddingTaskDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddingTaskDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddingTaskDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
