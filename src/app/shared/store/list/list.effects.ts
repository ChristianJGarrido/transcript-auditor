import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  mergeMap,
  map,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
  HttpErrorResponse,
} from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { StoreModel } from '../../../app.store';
import * as listActions from './list.actions';
import { ListModel, ListAgent, ListSkill, ListGroup } from './list.model';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class ListEffects {
  // select playlist
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType<listActions.Query>(listActions.QUERY)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {
        const { domains, account, bearer } = apiLogin;
        const url = `https://${
          domains.accountConfigReadWrite
        }/api/account/${account}/configuration/le-users`;
        const headers = new HttpHeaders()
          .set('Accept', 'application/json')
          .set('Content-Type', 'application/json')
          .set('Authorization', `Bearer ${bearer}`);
        const urlAgents = `${url}/users?v=4.0&select=$all`;
        const urlSkills = `${url}/skills?v=2.0&select=$all`;
        const urlGroups = `${url}/agentGroups?v=2.0&select=$all`;
        const httpAgent = this.http.get<ListAgent[]>(urlAgents, { headers });
        const httpSkills = this.http.get<ListSkill[]>(urlSkills, { headers });
        const httpGroups = this.http.get<ListGroup[]>(urlGroups, { headers });
        return forkJoin(httpAgent, httpSkills, httpGroups).pipe(
          switchMap(([agent, skills, groups]) => {
            return [
              new listActions.AddAgents(agent),
              new listActions.AddSkills(skills),
              new listActions.AddGroups(groups),
            ];
          })
        );
      }),
      catchError(err => [new listActions.Error(err)])
    );

  constructor(
    private http: HttpClient,
    private store: Store<StoreModel>,
    private actions$: Actions
  ) {}
}
