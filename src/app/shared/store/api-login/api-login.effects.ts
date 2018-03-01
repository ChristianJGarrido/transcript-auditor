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

import { ApiLoginModel } from '../api-login/api-login.model';
import * as ApiLoginActions from '../api-login/api-login.actions';
import * as AssessmentActions from '../assessment/assessment.actions';
import * as PlaylistActions from '../playlist/playlist.actions';
import * as ConversationActions from '../conversation/conversation.actions';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ModalComponent } from '../../../main/modal/modal.component';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class ApiLoginEffects {
  dialogRef: MatDialogRef<ModalComponent>;

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
        return new ApiLoginActions.NotAuthenticated(true);
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
            return new ApiLoginActions.NotAuthenticated(false);
          }),
          catchError((error: HttpErrorResponse) => {
            const message = error.message;
            this.notificationService.openSnackBar(
              `Error: username or password incorrect`
            );
            return [new ApiLoginActions.LoginError(error)];
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
    .pipe(
      switchMap(action => {
        if (this.dialogRef) {
          this.dialogRef.close();
        }
        return [
          new ConversationActions.Query(),
          new AssessmentActions.Query(),
          new PlaylistActions.Query(),
        ];
      })
    );

  @Effect({ dispatch: false })
  apiLogout$: Observable<any> = this.actions$
    .ofType<ApiLoginActions.NotAuthenticated>(ApiLoginActions.NOT_AUTHENTICATED)
    .pipe(
      map(action => {
        sessionStorage.removeItem('ca_Bearer');
        if (action.dialog) {
          setTimeout(() => this.openDialog(), 100);
        }
        return Observable.of(null);
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
}
