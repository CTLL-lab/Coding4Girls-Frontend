import { Component, OnInit, OnDestroy, PipeTransform } from '@angular/core';
import { SolutionsService } from '../services/solutions/solutions.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: ['./solutions.component.css']
})
export class SolutionsComponent implements OnInit, OnDestroy {
  private lobbySolutionsSubscriber: Subscription;
  private lobbyID: string;
  public rows = [];
  public columns = [
    { name: 'Username', prop: 'username' },
    { name: 'First name', prop: 'fname' },
    { name: 'Last name', prop: 'lname' },
    { name: 'Challenge name', prop: 'challengeName' },
    { name: 'Solution link' },
    {
      name: 'Submitted',
      pipe: new SubmittedPipe()
    }
  ];
  constructor(
    private solutionsService: SolutionsService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.lobbyID = this.route.snapshot.paramMap.get('id');
    this.lobbySolutionsSubscriber = this.solutionsService
      .GetLobbySolutions(this.lobbyID)
      .subscribe(x => {
        this.rows = (<Array<any>>x).map(element => {
          return {
            username: element.username,
            fname: element.fname,
            lname: element.lname,
            challengeName: element.name,
            submitted: element.last_update != null
          };
        });
      });
  }

  ngOnDestroy() {
    this.lobbySolutionsSubscriber.unsubscribe();
  }

  GetCSSClassForRow(row) {
    if (row.submitted) {
      return 'ngx-datatable-submitted';
    }
    return '';
  }
}

class SubmittedPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    return value ? '✅' : '—';
  }
}
