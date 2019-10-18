import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { AnswersService } from '../services/answers/answers.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from 'src/app/authentication/services/user/user.service';
import { NavbarService } from 'src/app/core/navbar/navbar.service';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit {
  private lobbyID: string;
  public rows = [];
  public currentState: SolutionsComponentState;
  public comparison = false;
  constructor(
    private answersService: AnswersService,
    private route: ActivatedRoute,
    private router: Router,
    private translation: TranslateService,
    private userService: UserService,
    private navbarService: NavbarService
  ) {}

  ngOnInit() {
    this.lobbyID = this.route.snapshot.paramMap.get('id');
    this.route.data.subscribe(x => {
      if (x['lobby']) {
        if (!this.userService.IsUserPriviledged()) {
          return;
        }
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
      } else if (x['challenge']) {
        if (!this.userService.IsUserPriviledged()) {
          return;
        }
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
      } else if (x['comparison']) {
        this.navbarService.hide();
        this.comparison = true;
        this.currentState = new AnonymousSolutionsState();
        this.answersService
          .GetAnonymousLobbySolutions(this.lobbyID)
          .subscribe(async x => {
            let answerTranslatedString = await this.translation
              .get('variables.10')
              .toPromise();
            this.rows = (<Array<any>>x).map((element, i) => {
              return {
                username: answerTranslatedString + ' ' + i,
                submitted: element.last_update != null,
                link:
                  element.last_update != null
                    ? '<a href="/#/lobby/' +
                      this.lobbyID +
                      '/solutions/' +
                      element.userid +
                      '/comparison">Solution</a>'
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

class AnonymousSolutionsState implements SolutionsComponentState {
  public columns = [
    { name: 'Answer', prop: 'username' },
    { name: 'Solution link', prop: 'link' }
  ];
}
