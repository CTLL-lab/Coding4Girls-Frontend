import { Component } from '@angular/core';
import { SpinnerService } from './shared/services/spinner/spinner.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Coding4Girls';
  constructor(public spinner: SpinnerService) {}

  reload() {
    location.reload();
  }
}
