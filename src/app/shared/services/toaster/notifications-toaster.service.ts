import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationsToasterService {
  constructor(
    private toaster: ToastrService,
    private translation: TranslateService
  ) {}
  showSuccess(message: string) {
    this.translation
      .get('in-code.13')
      .toPromise()
      .then(x => {
        this.toaster.success(message, x, {
          positionClass: 'toast-bottom-right',
          progressBar: true,
          timeOut: 3500
        });
      });
  }
  showError(message: string) {
    this.translation
      .get('in-code.14')
      .toPromise()
      .then(x => {
        this.toaster.error(message, x, {
          positionClass: 'toast-bottom-right',
          progressBar: true,
          timeOut: 3500
        });
      });
  }
}
