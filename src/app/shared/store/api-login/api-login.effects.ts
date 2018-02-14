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

@Injectable()
export class ApiLoginEffects {
  @Effect()
  getSession$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.GetSession>(ApiLoginActions.GET_SESSION)
    .pipe(
      map(action => {
        // retrieve from storage
        const bearer =
          sessionStorage.getItem('transcriptAuditorBearer') || null;
        const domains = localStorage.getItem('transcriptAuditorDomains');
        const user = {
          bearer,
          username: localStorage.getItem('transcriptAuditorUsername') || '',
          account: localStorage.getItem('transcriptAuditorAccount') || '',
          isLPA:
            localStorage.getItem('transcriptAuditorLPA') === 'true'
              ? true
              : false,
          domains: domains
            ? JSON.parse(domains)
            : { msgHist: '', agentVep: '', engHist: '' },
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
                  bearer: response.bearer,
                  username: user.username,
                  account: user.account,
                  isLPA: response.config.isLPA,
                  domains: domains,
                };
                return new ApiLoginActions.SaveSession(session);
              } else {
                return new ApiLoginActions.NotAuthenticated();
              }
            }),
            catchError(err => {
              return [new ApiLoginActions.LoginError(err)];
            })
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
        sessionStorage.setItem('transcriptAuditorBearer', bearer);
        localStorage.setItem(
          'transcriptAuditorDomains',
          JSON.stringify(domains)
        );
        localStorage.setItem('transcriptAuditorUsername', username);
        localStorage.setItem('transcriptAuditorAccount', account);
        localStorage.setItem('transcriptAuditorLPA', isLPA.toString());
        return new ApiLoginActions.Authenticated(action.session);
      })
    );

  @Effect()
  apiAuth$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.Authenticated>(ApiLoginActions.AUTHENTICATED)
    .pipe(
      map(action => {
        return new ApiDataActions.GetData();
      })
    );

  @Effect()
  apiLogout$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.Logout>(ApiLoginActions.LOGOUT)
    .pipe(
      map(action => {
        sessionStorage.removeItem('transcriptAuditorBearer');
        return new ApiLoginActions.NotAuthenticated();
      })
    );

  constructor(private actions$: Actions, private http: HttpClient) {}
}
