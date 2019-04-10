import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SpinnerService {
  private isActive: boolean;
  public loadingText: BehaviorSubject<string>;
  constructor(private spinner: NgxSpinnerService) {
    this.isActive = false;
    this.loadingText = new BehaviorSubject('');
  }

  show(loadingText?: string, timeout?: number) {
    if (!this.isActive) {
      this.isActive = true;
      setTimeout(_ => {
        if (this.isActive) {
          this.loadingText.next(loadingText);
        }
      }, timeout);
      this.spinner.show();
    }
  }
  hide() {
    if (this.isActive) {
      this.isActive = false;
      this.spinner.hide();
      this.loadingText.next('');
    }
  }
}
