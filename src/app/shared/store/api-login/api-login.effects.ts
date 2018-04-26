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
  HttpErrorResponse,
} from '@angular/common/http';

import {
  ApiLoginModel,
  ApiDomainsResponse,
  ApiDomains,
  ApiDomainsState,
  ApiLoginResponse,
} from '../api-login/api-login.model';
import * as apiLoginActions from '../api-login/api-login.actions';
import * as assessmentActions from '../assessment/assessment.actions';
import * as playlistActions from '../playlist/playlist.actions';
import * as conversationActions from '../conversation/conversation.actions';
import * as listActions from '../list/list.actions';
import * as statsActions from '../stats/stats.actions';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ModalComponent } from '../../../main/modal/modal.component';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class ApiLoginEffects {
  dialogRef: MatDialogRef<ModalComponent>;

  @Effect()
  getSession$: Observable<any> = this.actions$
    .ofType<apiLoginActions.GetSession>(apiLoginActions.GET_SESSION)
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
          return new apiLoginActions.Authenticated(user);
        }
        return new apiLoginActions.NotAuthenticated(true);
      })
    );

  @Effect()
  apiDomains$: Observable<any> = this.actions$
    .ofType<apiLoginActions.GetDomains>(apiLoginActions.GET_DOMAINS)
    .pipe(
      switchMap(action => {
        const { user } = action;
        const services = [
          'accountConfigReadWrite',
          'msgHist',
          'agentVep',
          'engHistDomain',
        ];
        const url = `https://api.liveperson.net/api/account/${
          user.account
        }/service/baseURI?version=1.0&services=${services}`;
        return this.http.get<ApiDomainsResponse>(url).pipe(
          map(response => {
            if (response.baseURIs) {
              const domains = this.saveDomains(response);
              return new apiLoginActions.Login(user, domains);
            }
            return new apiLoginActions.NotAuthenticated(false);
          }),
          catchError((error: HttpErrorResponse) => {
            const message = error.message;
            this.notificationService.openSnackBar(`Error: account incorrect`);
            return [new apiLoginActions.LoginError(error)];
          })
        );
      })
    );

  @Effect()
  apiLogin$: Observable<any> = this.actions$
    .ofType<apiLoginActions.Login>(apiLoginActions.LOGIN)
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
        return this.http.post<ApiLoginResponse>(url, body, { headers }).pipe(
          map(response => {
            if (response.bearer) {
              const session = {
                domains,
                bearer: response.bearer,
                username: user.username,
                account: user.account,
                isLPA: response.config.isLPA,
              };
              return new apiLoginActions.SaveSession(session);
            }
            return new apiLoginActions.NotAuthenticated(false);
          }),
          catchError((error: HttpErrorResponse) => {
            const message = error.message;
            this.notificationService.openSnackBar(
              `Error: username or password incorrect`
            );
            return [new apiLoginActions.LoginError(error)];
          })
        );
      })
    );

  @Effect()
  saveSession$: Observable<any> = this.actions$
    .ofType<apiLoginActions.SaveSession>(apiLoginActions.SAVE_SESSION)
    .pipe(
      map(action => {
        // save auth to sessionStorage
        const { bearer, username, account, isLPA, domains } = action.session;
        sessionStorage.setItem('ca_Bearer', bearer);
        localStorage.setItem('ca_Domains', JSON.stringify(domains));
        localStorage.setItem('ca_Username', username);
        localStorage.setItem('ca_Account', account);
        localStorage.setItem('ca_LPA', isLPA.toString());
        return new apiLoginActions.Authenticated(action.session);
      })
    );

  @Effect()
  queryData$: Observable<any> = this.actions$
    .ofType<apiLoginActions.Authenticated>(apiLoginActions.AUTHENTICATED)
    .pipe(
      switchMap(action => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        return [
          new listActions.Query(),
          new conversationActions.Query('many'),
          new assessmentActions.Query(),
          new playlistActions.Query(),
          new statsActions.Build(),
        ];
      })
    );

  @Effect()
  apiLogout$: Observable<any> = this.actions$
    .ofType<apiLoginActions.NotAuthenticated>(apiLoginActions.NOT_AUTHENTICATED)
    .pipe(
      switchMap(action => {
        sessionStorage.removeItem('ca_Bearer');
        if (action.dialog) {
          setTimeout(() => this.openDialog(), 100);
        }
        return [
          new listActions.Reset(),
          new conversationActions.Reset(),
          new assessmentActions.Reset(),
          new playlistActions.Reset(),
        ];
      })
    );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    public dialog: MatDialog,
    private notificationService: NotificationService
  ) {}

  // opens material dialog
  openDialog(): void {
    this.dialogRef = this.dialog.open(ModalComponent, {
      maxWidth: 400,
      position: { top: '5%', right: '5%' },
    });
  }

  /**
   * Save extract domains from response
   */
  saveDomains(response: ApiDomainsResponse): ApiDomains {
    return response.baseURIs.reduce((services, current) => {
      return {
        ...services,
        [current.service]: current.baseURI,
      };
    }, new ApiDomainsState());
  }
}
