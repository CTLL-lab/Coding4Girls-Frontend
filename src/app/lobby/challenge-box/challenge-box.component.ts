import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-challenge-box',
  templateUrl: './challenge-box.component.html',
  styleUrls: ['./challenge-box.component.css']
})
export class ChallengeBoxComponent implements OnInit {
  @Input()
  TopText: string;
  @Input()
  MiddleText: string;
  @Input()
  BottomText: string;
  @Input()
  ButtonText: string;
  @Input()
  id: string;
  @Output()
  ButtonClicked = new EventEmitter();
  @Output()
  SettingsClicked = new EventEmitter();
  @Output()
  modalRequest = new EventEmitter();
  constructor() {}

  ngOnInit() {}

  clickButton() {
    this.ButtonClicked.emit(this.id);
  }

  settingsClicked() {
    this.SettingsClicked.emit(this.id);
  }
  requestModal() {
    this.modalRequest.emit(this.id);
  }
}

export interface ChallengeBoxOptions {
  ShowReviewRequested: boolean;
  ShowBrainstormRequested: boolean;
  ShowHelpAsked: boolean;
  ShowCompleted: boolean;
  ShowChallengeNotVerified: boolean;
  MaxTeamSize: number;
  UserMemberOfTeam: boolean;
  CanStart: boolean;
  CanJoin: boolean;
  HasNotEnoughMembers: boolean;
  CanView: boolean;
  CanStudentsView: boolean;
  CanVerify: boolean;
  IsUserPriviledged: boolean;
}
