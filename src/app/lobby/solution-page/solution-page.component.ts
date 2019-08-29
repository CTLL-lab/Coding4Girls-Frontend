import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChallengeService } from '../services/challenge/challenge.service';
import { AnswersService } from '../services/answers/answers.service';

@Component({
  selector: 'app-solution-page',
  templateUrl: './solution-page.component.html',
  styleUrls: ['./solution-page.component.css']
})
export class SolutionPageComponent implements OnInit {
  public worldBehaviorSubject: BehaviorSubject<any> = new BehaviorSubject(null);
  public worldSubscription: Subscription;

  private userID = this.route.snapshot.paramMap.get('userID');
  private challengeID = this.route.snapshot.paramMap.get('challengeID');
  private lobbyID = this.route.snapshot.paramMap.get('id');
  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private answersService: AnswersService
  ) {
    window['world'] = this.worldBehaviorSubject;
  }

  ngOnInit() {
    this.worldSubscription = this.worldBehaviorSubject.subscribe(x => {
      if (x == null) {
        return;
      }
      if (this.route.snapshot.data['lobby']) {
        this.answersService
          .GetLobbySolutionForUser(this.userID, this.lobbyID)
          .subscribe(y => {
            x.children[0].openProjectString(
              y['data']['solution']['snap_solution']
            );
          });
      } else {
        this.challengeService
          .GetChallengeSnapSolutionFromUser(this.challengeID, this.userID)
          .subscribe(y => {
            x.children[0].openProjectString(
              y['data']['solution']['snap_solution']
            );
          });
        this.worldSubscription.unsubscribe();
      }
    });
  }
}
