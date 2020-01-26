import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private levelID = this.route.snapshot.paramMap.get('levelID');
  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService,
    private answersService: AnswersService,
    private router: Router
  ) {
    window['world'] = this.worldBehaviorSubject;
  }
  goBack() {
    if (this.route.snapshot.data['comparison']) {
      this.router.navigate([
        '/lobby/' + this.lobbyID + '/solutions/comparison'
      ]);
    } else if (this.route.snapshot.data['lobby']) {
      this.router.navigate(['/lobby/' + this.lobbyID + '/solutions/']);
    } else if (this.route.snapshot.data['challenge']) {
      this.router.navigate([
        '/lobby/' + this.lobbyID + '/solutions/challenges'
      ]);
    }
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
            if (y['data']['solution']['snap_solution']) {
              x.children[0].openProjectString(
                y['data']['solution']['snap_solution']
              );
            }
          });
      } else {
        this.challengeService
          .GetChallengeSnapSolutionFromUser(
            this.challengeID,
            this.levelID,
            this.userID
          )
          .subscribe(y => {
            if (y['data']['solution']['snap_solution']) {
              x.children[0].openProjectString(
                y['data']['solution']['snap_solution']
              );
            }
          });
        this.worldSubscription.unsubscribe();
      }
    });
  }
}
