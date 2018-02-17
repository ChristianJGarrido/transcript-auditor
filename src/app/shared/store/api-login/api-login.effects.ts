import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, exhaustMap, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';

import { ApiLoginModel } from '../api-login/api-login.model';
import * as ApiLoginActions from '../api-login/api-login.actions';
import * as ApiDataActions from '../api-data/api-data.actions';
import * as AssessmentActions from '../assessment/assessment.actions';

@Injectable()
export class ApiLoginEffects {
  @Effect()
  getSession$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.GetSession>(ApiLoginActions.GET_SESSION)
    .pipe(
      map(action => {
        // retrieve from storage
        const bearer = sessionStorage.getItem('ca_Bearer') || null;
        const domains = localStorage.getItem('ca_Domains');
        const user = {
          bearer,
          username: localStorage.getItem('ca_Username') || '',
          account: localStorage.getItem('ca_Account') || '',
          isLPA: localStorage.getItem('ca_LPA') === 'true' ? true : false,
          domains: domains
            ? JSON.parse(domains)
            : { msgHist: '', agentVep: '', engHistDomain: '' },
        };
        if (bearer) {
          return new ApiLoginActions.Authenticated(user);
        }
        return new ApiLoginActions.NotAuthenticated();
      })
    );

  @Effect()
  apiLogin$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.Login>(ApiLoginActions.LOGIN)
    .pipe(
      switchMap(action => {
        const { domains, user } = action;
        const headers = new HttpHeaders().set(
          'Content-Type',
          'application/json'
        );
        const url = `https://${domains.agentVep}/api/account/${
          user.account
        }/login`;
        const body = {
          username: user.username,
          password: user.password,
        };
        return this.http.post<any>(url, body, { headers }).pipe(
          map(response => {
            if (response.bearer) {
              const session = {
                domains,
                bearer: response.bearer,
                username: user.username,
                account: user.account,
                isLPA: response.config.isLPA,
              };
              return new ApiLoginActions.SaveSession(session);
            }
            return new ApiLoginActions.NotAuthenticated();
          }),
          catchError(err => [new ApiLoginActions.LoginError(err)])
        );
      })
    );

  @Effect()
  saveSession$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.SaveSession>(ApiLoginActions.SAVE_SESSION)
    .pipe(
      map(action => {
        // save auth to sessionStorage
        const { bearer, username, account, isLPA, domains } = action.session;
        sessionStorage.setItem('ca_Bearer', bearer);
        localStorage.setItem('ca_Domains', JSON.stringify(domains));
        localStorage.setItem('ca_Username', username);
        localStorage.setItem('ca_Account', account);
        localStorage.setItem('ca_LPA', isLPA.toString());
        return new ApiLoginActions.Authenticated(action.session);
      })
    );

  @Effect()
  queryData$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.Authenticated>(ApiLoginActions.AUTHENTICATED)
    .pipe(switchMap(action => [
      new ApiDataActions.GetConversations(),
      new AssessmentActions.Query()
    ]));

  @Effect({ dispatch: false })
  apiLogout$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.NotAuthenticated>(ApiLoginActions.NOT_AUTHENTICATED)
    .pipe(
      map(action => {
        sessionStorage.removeItem('ca_Bearer');
        return Observable.of(null);
      })
    );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
