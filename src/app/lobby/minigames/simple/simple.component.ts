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
  @Input() prefilled_variables;

  constructor() {}

  ngOnInit() {
    // if prefilled variables is {} and doesn't contain questions array
    try {
      this.prefilled_variables;
    } catch {
      // make it undefined
      this.prefilled_variables = undefined;
    }

    if (this.prefilled_variables != undefined) {
      for (let key in this.prefilled_variables) {
        try {
          this.form.get(key).setValue(this.prefilled_variables[key]);
        } catch (err) {
          continue;
        }
      }
    }
  }
}
