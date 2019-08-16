import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiURL } from 'src/app/config';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SolutionsService {
  constructor(private http: HttpClient) {}

  GetLobbySolutions(lobbyID: string) {
    return this.http
      .get(apiURL + '/lobbies/' + lobbyID + '/solutions', {
        observe: 'response'
      })
      .pipe(
        map(x => {
          return x.body;
        })
      );
  }
}
