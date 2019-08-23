import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-brainstorm',
  templateUrl: './brainstorm.component.html',
  styleUrls: ['./brainstorm.component.css']
})
export class BrainstormComponent implements OnInit {
  public lobbyID: string;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.lobbyID = this.route.snapshot.params.id;
  }
}
