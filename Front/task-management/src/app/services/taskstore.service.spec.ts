import { TestBed } from '@angular/core/testing';

import { TaskstoreService } from './taskstore.service';

describe('TaskstoreService', () => {
  let service: TaskstoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskstoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
