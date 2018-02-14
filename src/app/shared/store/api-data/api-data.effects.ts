import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, withLatestFrom, catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';

import * as ApiDataActions from '../api-data/api-data.actions';
import { ApiDataModel, ApiMsgHist } from '../api-data/api-data.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import { ApiLoginModel } from '../api-login/api-login.model';

@Injectable()
export class ApiDataEffects {
  @Effect()
  getData$: Observable<any> = this.actions$
    .ofType<ApiDataActions.GetData>(ApiDataActions.GET_DATA)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {
        const { url, body, headers, params } = this.generateRequest(apiLogin);
        return this.http.post<ApiMsgHist>(url, body, { headers, params }).pipe(
          switchMap(response => {
            return [new ApiDataActions.SaveData(response)];
          }),
          catchError(err => {
            return [new ApiDataActions.DataError(err)];
          })
        );
      })
    );

  @Effect()
  selectData$: Observable<any> = this.actions$
    .ofType<ApiDataActions.SaveData>(ApiDataActions.SAVE_DATA)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiData)),
      switchMap(([action, apiData]) => {
        const length = apiData.msgHist.conversationHistoryRecords.length;
        if (!apiData.select && length) {
          const index = Math.floor((Math.random() * length));
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
  convertDateToMs(dateFrom: Date, dateTo: Date): { from: number; to: number } {
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
   * Get data
   */
  generateRequest(apiLogin: ApiLoginModel) {
    const { domains, account, bearer } = apiLogin;
    // prepare URL
    const url = `https://${
      domains.msgHist
    }/messaging_history/api/account/${account}/conversations/search`;
    // get start
    const to = new Date();
    const dateTo = new Date(to.setDate(to.getDate() - 1));
    const dateFrom = new Date(to.setDate(to.getDate() - 7));
    const start = this.convertDateToMs(dateFrom, dateTo);
    // prepare body
    const body = { start };
    // set headers
    const headers = this.getHeaders(bearer);
    // set params
    const params: HttpParams = new HttpParams()
      .set('limit', '100')
      .set('offset', '0')
      .set('sort', 'start:desc');
    // return request objects
    return { url, body, headers, params };
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
