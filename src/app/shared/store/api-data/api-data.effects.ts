import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import {
  map,
  switchMap,
  withLatestFrom,
  catchError,
  combineLatest,
} from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';

import * as ApiLoginActions from '../api-login/api-login.actions';
import * as ApiDataActions from '../api-data/api-data.actions';
import { ApiDataModel, ApiMsgHist, ApiEngHist } from '../api-data/api-data.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import { ApiLoginModel } from '../api-login/api-login.model';

@Injectable()
export class ApiDataEffects {
  @Effect()
  getData$: Observable<any> = this.actions$
    .ofType<ApiDataActions.GetConversations>(ApiDataActions.GET_CONVERSATIONS)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {
        const msgHistReq = this.generateRequest(true, apiLogin);
        const engHistReq = this.generateRequest(false, apiLogin);
        const msgHistObs = this.http.post<ApiMsgHist>(msgHistReq.url, msgHistReq.body, msgHistReq.options);
        const engHistObs = this.http.post<ApiEngHist>(engHistReq.url, engHistReq.body, engHistReq.options);
        return msgHistObs.pipe(
          combineLatest(engHistObs),
          switchMap(([msgHist, engHist]) => {
            return [new ApiDataActions.SaveConversations({
              msgHist,
              engHist
            })];
          }),
          catchError(err => {
            if (err.status === 401) {
              return [{type: 'error'}, new ApiLoginActions.NotAuthenticated()];
            }
            return [new ApiDataActions.DataError(err)];
          })
        );
      })
    );

  @Effect()
  selectData$: Observable<any> = this.actions$
    .ofType<ApiDataActions.SaveConversations>(ApiDataActions.SAVE_CONVERSATIONS)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiData)),
      switchMap(([action, apiData]) => {
        const length = apiData.msgHist.conversationHistoryRecords.length;
        if (!apiData.select && length) {
          const index = Math.floor(Math.random() * length);
          const select = apiData.msgHist.conversationHistoryRecords[index];
          return [new ApiDataActions.SelectConversation(select)];
        }
        return [new ApiDataActions.SelectConversation(apiData.select)];
      })
    );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<StoreModel>
  ) {}

  /**
   * helper method to calculate ms from dates
   * @return {number, number}
   */
  convertDateToMs(): { from: number; to: number } {
    const now = new Date();
    const dateTo = new Date(now.setDate(now.getDate() - 1));
    const dateFrom = new Date(now.setDate(now.getDate() - 7));
    const from: number = Math.round(dateFrom.getTime());
    const to: number = Math.round(dateTo.getTime());
    return { from, to };
  }

  /**
   * @return {HttpHeaders}
   */
  getHeaders(token: string): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /**
   * Get data from either Eng Hist API or Msg Hist API
   * @param {boolean} messagingMode
   * @param {ApiLoginModel} apiLogin
   */
  generateRequest(messagingMode: boolean, apiLogin: ApiLoginModel) {
    const { domains, account, bearer } = apiLogin;
    const { msgHist, engHistDomain } = domains;
    const domain = messagingMode ? msgHist : engHistDomain;
    const history = messagingMode ? 'messaging_history' : 'interaction_history';
    const interaction = messagingMode ? 'conversations' : 'interactions';
    const url = `https://${domain}/${history}/api/account/${account}/${interaction}/search`;
    const start = this.convertDateToMs();
    const body = { start };
    const headers = this.getHeaders(bearer);
    const params: HttpParams = new HttpParams()
      .set('limit', '100')
      .set('offset', '0')
      .set('sort', 'start:desc');
    return { url, body, options: { headers, params } };
  }

  // /**
  //  * method to get a single conversation from API
  //  * @param {string} conversationId
  //  */
  // getConversationById(conversationId: string) {
  //   // prepare URL
  //   const url = `https://${this.apiLoginService.domains.msgHist}/messaging_history/api/account/${
  //     this.apiLoginService.user.account
  //   }/conversations/conversation/search`;
  //   // prepare body
  //   const body = { conversationId };
  //   // set headers
  //   const headers = this._getHeaders();
  //   // make request
  //   this._httpRequest(false, url, body, { headers, params: null });
  // }
}
