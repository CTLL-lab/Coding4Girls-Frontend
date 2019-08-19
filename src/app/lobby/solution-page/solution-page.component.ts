import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ChallengeService } from '../services/challenge/challenge.service';

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

  constructor(
    private route: ActivatedRoute,
    private challengeService: ChallengeService
  ) {
    window['world'] = this.worldBehaviorSubject;
  }

  ngOnInit() {
    this.worldSubscription = this.worldBehaviorSubject.subscribe(x => {
      if (x == null) {
        return;
      }
      this.challengeService
        .GetChallengeSnapSolutionFromUser(this.challengeID, this.userID)
        .subscribe(y => {
          x.children[0].openProjectString(
            y['data']['solution']['snap_solution']
          );
        });
      this.worldSubscription.unsubscribe();
    });
  }
}
