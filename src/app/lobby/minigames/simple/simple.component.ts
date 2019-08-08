import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MinigameItem } from '../minigame-item';
import { MinigameService } from '../minigame.service';

@Component({
  selector: 'app-minigame-simple',
  templateUrl: './simple.component.html',
  styleUrls: ['./simple.component.css']
})
export class SimpleComponent implements OnInit {
  @Input() variables;
  @Input() form: FormGroup;
  constructor() {}

  ngOnInit() {
    console.log(this.variables, this.form);
  }
}
