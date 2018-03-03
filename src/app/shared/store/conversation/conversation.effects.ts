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
  HttpErrorResponse,
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
  // query
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType<conversationActions.Query>(conversationActions.QUERY)
    .pipe(
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(fromConversation.selectId)
      ),
      debounceTime(1000),
      switchMap(([action, apiLogin, selectId]) => {
        const { queryType, options } = action;
        const queryOne = queryType === 'conversation';
        if (!queryOne) {
          this.notifcationService.openSnackBar('Downloading conversations...');
        }
        const payload = queryOne ? selectId : null;
        return forkJoin(
          this.getHttpObs<MsgHistResponse>(true, apiLogin, payload),
          this.getHttpObs<EngHistResponse>(false, apiLogin, payload)
        ).pipe(
          map(([msgHist, engHist]) => {
            const msgHistRecords = this.transformResponse(msgHist, true);
            const engHistRecords = this.transformResponse(engHist, false);
            return [...msgHistRecords, ...engHistRecords];
          }),
          map(data => {
            if (queryType === 'many' || queryType === 'conversation') {
              return new conversationActions.AddMany(data);
            } else if (action.queryType === 'all') {
              return new conversationActions.AddAll(data);
            }
          }),
          catchError(err => this.handleError(err))
        );
      })
    );

  // select after add
  @Effect()
  selectAfterAdd$: Observable<Action> = this.actions$
    .ofType(conversationActions.ADD_MANY)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectOne),
        this.store.select(fromConversation.selectAll)
      ),
      map(([action, conversation, conversations]) => {
        if (conversation) {
          return new conversationActions.SuccessSelect();
        }
        const index = Math.floor(Math.random() * conversations.length);
        return new conversationActions.Select(conversations[index].id);
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
        const fallbackId = selectIds[0] && selectIds[0].toString();
        const newId = selectId || fallbackId || null;
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
        return new conversationActions.Query('conversation');
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
   * Generate request and return http obs
   * @param {boolean} messagingMode
   * @param {ApiLogin} apiLogin
   * @param {string?} payload
   */
  getHttpObs<T>(
    messagingMode: boolean,
    apiLogin: ApiLoginModel,
    payload?: string
  ) {
    const { url, body, options } = this.generateRequest(
      messagingMode,
      apiLogin,
      payload
    );
    return this.http.post<T>(url, body, options);
  }

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
    const isChat = !msgHist;
    return response[recordProp].map(record => {
      return {
        ...record,
        isChat,
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
   * prepares URL for request
   * @param {boolean} messagingMode
   * @param {ApiLoginModel}apiLogin
   * @param {string} selectId
   */
  generateUrl(messagingMode: boolean, apiLogin: ApiLoginModel, selectId) {
    const { domains, account } = apiLogin;
    const { msgHist, engHistDomain } = domains;
    const domain = messagingMode ? msgHist : engHistDomain;
    const history = messagingMode ? 'messaging_history' : 'interaction_history';
    const interaction = messagingMode ? 'conversation' : 'interaction';
    const queryType = selectId ? `${interaction}/` : '';
    const method = `${interaction}s/${messagingMode ? queryType : ''}`;
    return `https://${domain}/${history}/api/account/${account}/${method}search`;
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
    selectId?: string
  ) {
    const { bearer } = apiLogin;
    const url = this.generateUrl(messagingMode, apiLogin, selectId);
    const idParam = messagingMode ? 'conversationId' : 'engagementId';
    const body = selectId
      ? { [idParam]: selectId }
      : { start: this.convertDateToMs() };
    const headers = this.getHeaders(bearer);
    const params = selectId
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
  handleError(error: HttpErrorResponse): Observable<Action> {
    if (error.status === 401) {
      this.notifcationService.openSnackBar('Session expired');
      this.store.dispatch(new apiLoginActions.NotAuthenticated(false));
      return of(new conversationActions.Error(error));
    } else {
      const message = error.error && error.error.debugMessage;
      this.notifcationService.openSnackBar(
        `Error: ${message || error.message}`
      );
      return of(new conversationActions.Error(error));
    }
  }
}
