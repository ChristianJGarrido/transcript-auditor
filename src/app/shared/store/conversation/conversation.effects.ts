import { Injectable } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
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
import { UtilityService } from '../../services/utility.service';

@Injectable()
export class ConversationEffects {
  // query
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType<conversationActions.Query>(conversationActions.QUERY)
    .pipe(
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(fromConversation.selectId),
        this.store.select(state => state.filter)
      ),
      debounceTime(1000),
      switchMap(([action, apiLogin, selectId, filter]) => {
        const { queryType, options } = action;
        const queryConv = queryType === 'conversation';
        // prepare query from filter
        const { types, searchById, idTypes } = filter;
        const [idType] = idTypes;
        const getChat = types.indexOf('chats') !== -1;
        const getConversations = types.indexOf('conversations') !== -1;
        const filterParams = {
          searchById,
          idType: queryConv ? queryType : idType,
          chatIdKey:
            queryConv || idType === 'conversation' ? 'engagementId' : 'visitor',
          convIdKey:
            queryConv || idType === 'conversation'
              ? 'conversationId'
              : 'consumer',
        };

        if (!searchById || !queryConv) {
          this.notifcationService.openSnackBar('Downloading conversations...');
        }
        const payload = queryConv
          ? { selectId }
          : { start: this.utilityService.convertDateToMs() };
        const payloadMsg = options ? options.msg : payload;
        const payloadChat = options ? options.chat : payload;

        return forkJoin(
          getConversations
            ? this.generateRequest<MsgHistResponse>(
                true,
                apiLogin,
                payloadMsg,
                filterParams
              )
            : of(null),
          getChat
            ? this.generateRequest<EngHistResponse>(
                false,
                apiLogin,
                payloadChat,
                filterParams
              )
            : of(null)
        ).pipe(
          map(([msgHist, engHist]) => {
            const msgHistRecords = msgHist
              ? this.utilityService.transformResponse(msgHist)
              : [];
            const engHistRecords = engHist
              ? this.utilityService.transformResponse(engHist)
              : [];
            return [...msgHistRecords, ...engHistRecords];
          }),
          map(data => {
            if (!data.length) {
              return new conversationActions.Reset();
            }
            if (queryType === 'many' || queryType === 'conversation') {
              return new conversationActions.AddMany(data);
            } else if (action.queryType === 'all') {
              return new conversationActions.AddAll(data);
            }
          }),
          catchError(err => this.utilityService.handleError(err))
        );
      })
    );

  // select after add
  @Effect()
  selectAfterAdd$: Observable<Action> = this.actions$
    .ofType(conversationActions.ADD_ALL, conversationActions.ADD_MANY)
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
          return new conversationActions.Select(id);
        }
        const fallbackId = selectIds[0];
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
    private utilityService: UtilityService,
    private notifcationService: NotificationService,
    private http: HttpClient,
    private store: Store<StoreModel>,
    private actions$: Actions
  ) {}

  /**
   * prepares URL for request
   * @param {boolean} messagingMode
   * @param {ApiLoginModel}apiLogin
   * @param {string} selectId
   * @param {boolean} isConId
   */
  generateUrl(
    messagingMode: boolean,
    apiLogin: ApiLoginModel,
    selectId: string,
    filterParams: any
  ) {
    const { domains, account } = apiLogin;
    const { msgHist, engHistDomain } = domains;
    const { idType } = filterParams;
    const domain = messagingMode ? msgHist : engHistDomain;
    const history = messagingMode ? 'messaging_history' : 'interaction_history';
    const interaction = messagingMode ? 'conversation' : 'interaction';
    const queryString = idType === 'consumer' ? 'consumer' : interaction;
    const queryType = selectId ? `${queryString}/` : '';
    const method = `${interaction}s/${messagingMode ? queryType : ''}`;
    return `https://${domain}/${history}/api/account/${account}/${method}search`;
  }

  /**
   * Get data from either Eng Hist API or Msg Hist API
   * @param {boolean} messagingMode
   * @param {ApiLoginModel} apiLogin
   * @param {any?} options
   */
  generateRequest<T>(
    messagingMode: boolean,
    apiLogin: ApiLoginModel,
    options: any,
    filterParams: any
  ) {
    const { bearer } = apiLogin;
    const { searchById, chatIdKey, convIdKey } = filterParams;
    const idParam = messagingMode ? convIdKey : chatIdKey;
    const selectId = options.selectId || options[idParam];
    const url = this.generateUrl(
      messagingMode,
      apiLogin,
      selectId,
      filterParams
    );
    const body = selectId ? { [idParam]: selectId } : options;
    const headers = this.utilityService.getHeaders(bearer);
    const params = selectId
      ? null
      : new HttpParams()
          .set('limit', '100')
          .set('offset', '0')
          .set('sort', 'start:desc');
    return this.http.post<T>(url, body, { headers, params });
  }
}
