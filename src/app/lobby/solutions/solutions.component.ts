import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { AnswersService } from '../services/answers/answers.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {
  private lobbyID: string;
  public rows = [];
  public currentState: SolutionsComponentState;
  constructor(
    private answersService: AnswersService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.lobbyID = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe(x => {
      if (x['lobby']) {
        this.currentState = new LobbySolutionsState();
        this.answersService.GetLobbySolutions(this.lobbyID).subscribe(x => {
          this.rows = (<Array<any>>x).map(element => {
            return {
              username: element.username,
              fname: element.fname,
              lname: element.lname,
              submitted: element.last_update != null,
              link:
                element.last_update != null
                  ? '<a href="/#/lobby/24/solutions/' +
                    element.userid +
                    '/">Solution</a>'
                  : ''
            };
          });
        });
      } else {
        this.currentState = new ChallengeSolutionsState();
        this.answersService
          .GetLobbyChallengesSolutions(this.lobbyID)
          .subscribe(x => {
            this.rows = (<Array<any>>x).map(element => {
              return {
                username: element.username,
                fname: element.fname,
                lname: element.lname,
                challengeName: element.name,
                submitted: element.last_update != null,
                link:
                  element.last_update != null
                    ? '<a href="/#/lobby/24/solutions/' +
                      element.userid +
                      '/' +
                      element.challengeid +
                      '">Solution</a>'
                    : ''
              };
            });
          });
      }
    });
  }
  goBack() {
    this.router.navigate(['/lobby/' + this.lobbyID]);
  }
  GetCSSClassForRow(row) {
    if (row.submitted) {
      return 'ngx-datatable-submitted';
    }
    return '';
  }
}

interface SolutionsComponentState {
  columns: Array<any>;
}

class ChallengeSolutionsState implements SolutionsComponentState {
  public columns = [
    { name: 'Username', prop: 'username' },
    { name: 'First name', prop: 'fname' },
    { name: 'Last name', prop: 'lname' },
    { name: 'Challenge name', prop: 'challengeName' },
    { name: 'Solution link', prop: 'link' }
  ];
}

class LobbySolutionsState implements SolutionsComponentState {
  public columns = [
    { name: 'Username', prop: 'username' },
    { name: 'First name', prop: 'fname' },
    { name: 'Last name', prop: 'lname' },
    { name: 'Solution link', prop: 'link' }
  ];
}
