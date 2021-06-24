import { Component, OnInit } from '@angular/core';
import { TaskstoreService } from 'src/app/services/taskstore.service';

@Component({
  selector: 'app-owners',
  templateUrl: './owners.component.html',
  styleUrls: ['./owners.component.css']
})
export class OwnersComponent implements OnInit {

  owners: Task[] = []
  columns = ['id', 'name', 'description']
  
  constructor(private ts: TaskstoreService) { }

  ngOnInit(): void {
    this.ts.getOwners()
      .subscribe(res => {
        this.owners = res
      })
  }

}
