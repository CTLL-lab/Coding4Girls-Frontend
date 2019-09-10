import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, NgControlStatus } from '@angular/forms';

@Component({
  selector: 'app-form-element',
  templateUrl: './form-element.component.html',
  styleUrls: ['./form-element.component.css']
})
export class FormElementComponent implements OnInit {
  @Input() formElement;
  @Input() form: FormGroup;

  constructor() {}

  ngOnInit() {}
}
