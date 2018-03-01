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
import * as playlistActions from '../playlist/playlist.actions';
import * as fromConversation from './conversation.reducer';
import * as fromPlaylist from '../playlist/playlist.reducer';
import { ApiLoginModel } from '../api-login/api-login.model';
import { NotificationService } from '../../services/notification.service';

@Injectable()
export class ConversationEffects {
  // query all
  @Effect()
  queryAll$: Observable<Action> = this.actions$
    .ofType<conversationActions.Query>(conversationActions.QUERY)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      debounceTime(1000),
      switchMap(([action, apiLogin]) => {
        this.notifcationService.openSnackBar('Downloading conversations...');
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
          map(data => new conversationActions.AddMany(data)),
          catchError(err => this.handleError(err))
        );
      })
    );

  // query one
  @Effect()
  queryOne$: Observable<Action> = this.actions$
    .ofType(conversationActions.QUERY_CONV)
    .pipe(
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(fromConversation.selectId)
      ),
      debounceTime(500),
      switchMap(([action, apiLogin, selectId]) => {
        const msgHistReq = this.generateRequest(true, apiLogin, {
          conversationId: selectId,
        });
        return this.http
          .post<MsgHistResponse>(
            msgHistReq.url,
            msgHistReq.body,
            msgHistReq.options
          )
          .pipe(
            map(msgHist => this.transformResponse(msgHist, true)),
            map(data => new conversationActions.AddOne(data[0])),
            catchError(err => this.handleError(err))
          );
      })
    );

  // filter
  @Effect()
  filter$: Observable<Action> = this.actions$
    .ofType(conversationActions.FILTER_PLAYLIST)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectId),
        this.store.select(fromConversation.selectIds),
        this.store.select(fromConversation.selectPlaylistIds)
      ),
      map(([action, selectId, selectIds, playlistIds]) => {
        // check if current selected exists in new playlist
        const existsInPlaylist = playlistIds.includes(selectId);
        if (!existsInPlaylist && playlistIds.length) {
          // doesn't exist and playlist ids are available
          const id = playlistIds[0];
          return new conversationActions.Select(id.toString());
        }
        const newId = selectId || selectIds[0].toString();
        return new conversationActions.Select(newId);
      })
    );

  // select
  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(conversationActions.SELECT)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectOne),
        this.store.select(fromConversation.selectId)
      ),
      map(([action, conversation, selectId]) => {
        if (conversation) {
          return new conversationActions.SuccessSelect();
        }
        return new conversationActions.QueryConv(selectId);
      })
    );

  // success after add
  @Effect()
  success$: Observable<Action> = this.actions$
    .ofType(
      conversationActions.ADD_ALL,
      conversationActions.ADD_MANY,
      conversationActions.ADD_ONE
    )
    .pipe(map(() => new conversationActions.SuccessAdd()));

  constructor(
    private notifcationService: NotificationService,
    private http: HttpClient,
    private store: Store<StoreModel>,
    private actions$: Actions
  ) {}

  /**
   * transforms response items before adding to store
   * @param {any} response
   * @param {boolean} msgHist
   */
  transformResponse(response: any, msgHist: boolean): ConversationModel[] {
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
    const interaction = messagingMode ? 'conversation' : 'interaction';
    const idParam = messagingMode ? 'conversationId' : 'engagementId';
    const queryOne = options && options[idParam];
    const method = `${interaction}s/${queryOne ? interaction + '/' : ''}search`;
    const url = `https://${domain}/${history}/api/account/${account}/${method}`;
    const body = options ? options : { start: this.convertDateToMs() };
    const headers = this.getHeaders(bearer);
    const params = queryOne
      ? null
      : new HttpParams()
          .set('limit', '100')
          .set('offset', '0')
          .set('sort', 'start:desc');
    return { url, body, options: { headers, params } };
  }

  /**
   * handles error from catchError
   * @param {any} err
   * @return {Observable<Action>}
   */
  handleError(err: any): Observable<Action> {
    if (err.status === 401) {
      this.notifcationService.openSnackBar('Session expired');
      this.store.dispatch(new apiLoginActions.NotAuthenticated(false));
      return of(new conversationActions.Error(err));
    } else {
      const message = err.error && err.error.debugMessage;
      this.notifcationService.openSnackBar(`Error: ${message || err.message}`);
      return of(new conversationActions.Error(err));
    }
  }
}
