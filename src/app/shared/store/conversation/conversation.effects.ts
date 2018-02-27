import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  mergeMap,
  map,
  withLatestFrom,
  catchError,
  debounceTime,
  distinctUntilChanged,
  combineLatest,
  merge,
} from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { forkJoin } from 'rxjs/observable/forkJoin';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams,
} from '@angular/common/http';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { StoreModel } from '../../../app.store';
import {
  ConversationModel,
  MsgHistResponse,
  EngHistResponse,
} from './conversation.model';
import * as apiLoginActions from '../api-login/api-login.actions';
import * as conversationActions from './conversation.actions';
import * as fromConversation from './conversation.reducer';
import { ApiLoginModel } from '../api-login/api-login.model';

@Injectable()
export class ConversationEffects {
  // query collection
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType<conversationActions.Query>(conversationActions.QUERY)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      debounceTime(1000),
      switchMap(([action, apiLogin]) => {
        const options = action.options;
        const msgHistReq = this.generateRequest(true, apiLogin, options);
        const engHistReq = this.generateRequest(false, apiLogin);
        const msgHistObs = this.http.post<MsgHistResponse>(
          msgHistReq.url,
          msgHistReq.body,
          msgHistReq.options
        );
        const engHistObs = this.http.post<EngHistResponse>(
          engHistReq.url,
          engHistReq.body,
          engHistReq.options
        );
        return forkJoin(msgHistObs, engHistObs).pipe(
          map(([msgHist, engHist]) => {
            const msgHistRecords = this.transformResponse(msgHist, true);
            const engHistRecords = this.transformResponse(engHist, false);
            return [...msgHistRecords, ...engHistRecords];
          }),
          map(data => new conversationActions.AddAll(data)),
          catchError(err => of(new conversationActions.Error(err)))
        );
      })
    );

  // select after add
  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(conversationActions.ADD_ALL)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectOne),
        this.store.select(fromConversation.selectIds)
      ),
      map(([action, data, ids]) => {
        if (!data && ids.length) {
          const index = 0;
          const id = ids[index];
          this.store.dispatch(
            new conversationActions.Select(id && id.toString())
          );
        }
        return new conversationActions.Success();
      })
    );

  constructor(
    private http: HttpClient,
    private store: Store<StoreModel>,
    private actions$: Actions
  ) {}

  /**
   * transforms response items before adding to store
   * @param {any} response
   * @param {boolean} msgHist
   */
  transformResponse(response: any, msgHist: boolean) {
    const recordProp = msgHist
      ? 'conversationHistoryRecords'
      : 'interactionHistoryRecords';
    const idProp = msgHist ? 'conversationId' : 'engagementId';
    const type = msgHist ? 'message' : 'chat';
    return response[recordProp].map(record => {
      return {
        ...record,
        type,
        id: record.info[idProp],
      };
    });
  }

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
   * @param {any?} options
   */
  generateRequest(
    messagingMode: boolean,
    apiLogin: ApiLoginModel,
    options?: any
  ) {
    const { domains, account, bearer } = apiLogin;
    const { msgHist, engHistDomain } = domains;
    const domain = messagingMode ? msgHist : engHistDomain;
    const history = messagingMode ? 'messaging_history' : 'interaction_history';
    const interaction = messagingMode ? 'conversations' : 'interactions';
    const url = `https://${domain}/${history}/api/account/${account}/${interaction}/search`;
    const start = this.convertDateToMs();
    const body = options ? options : { start };
    const headers = this.getHeaders(bearer);
    const params: HttpParams = new HttpParams()
      .set('limit', '100')
      .set('offset', '0')
      .set('sort', 'start:desc');
    return { url, body, options: { headers, params } };
  }
}
