import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationsToasterService {
  constructor(private toaster: ToastrService) {}
  showSuccess(message: string) {
    this.toaster.success(message, 'Success', {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      timeOut: 3500
    });
  }
  showError(message: string) {
    this.toaster.error(message, 'Error', {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      timeOut: 3500
    });
  }
  showAchievement(message: string) {
    this.toaster.info(message, 'Achievement unlocked', {
      positionClass: 'toast-bottom-right',
      progressBar: true,
      timeOut: 3500
    });
  }
}
