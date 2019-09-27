import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NavbarService {
  visible: boolean;
  constructor() {
    this.visible = true;
  }
  show() {
    this.visible = true;
  }
  hide() {
    this.visible = false;
  }
}
