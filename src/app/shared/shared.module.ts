// import ngx-translate and the http loader
import { TranslateModule, TranslatePipe } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { NgModule, ModuleWithProviders } from '@angular/core';
import { NgxSpinnerModule, NgxSpinnerComponent } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NotificationsToasterService } from './services/toaster/notifications-toaster.service';
import { SpinnerService } from './services/spinner/spinner.service';
import { AuthenticationService } from '../authentication/services/auth/authentication.service';
import { UserService } from '../authentication/services/user/user.service';
import { ModalModule, BsModalService } from 'node_modules/ngx-bootstrap';
import { LobbyService } from './services/lobby/lobby.service';
import { SocketioService } from './services/socketio/socketio.service';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgxSpinnerModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      resetTimeoutOnDuplicate: true
    }),
    ModalModule.forRoot()
  ],
  declarations: [],
  providers: [ToastrService],
  exports: [TranslatePipe, NgxSpinnerComponent]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        NotificationsToasterService,
        SpinnerService,
        UserService,
        BsModalService,
        LobbyService,
        SocketioService
      ]
    };
  }
}
