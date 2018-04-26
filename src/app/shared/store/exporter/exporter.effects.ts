import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  map,
  withLatestFrom,
  catchError,
  debounceTime,
  flatMap,
  bufferCount,
} from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { of } from 'rxjs/observable/of';
import { from } from 'rxjs/observable/from';
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
  MsgHistResponse,
  EngHistResponse,
  ConversationModel,
} from '../conversation/conversation.model';
import * as conversationActions from '../conversation/conversation.actions';
import * as playlistActions from '../playlist/playlist.actions';
import * as fromConversation from '../conversation/conversation.reducer';
import * as fromPlaylist from '../playlist/playlist.reducer';
import * as fromAssessment from '../assessment/assessment.reducer';
import * as exporterActions from './exporter.actions';
import { NotificationService } from '../../services/notification.service';
import { ApiLoginModel } from '../api-login/api-login.model';
import { UtilityService } from '../../services/utility.service';
import { MessagesService } from '../../services/messages.service';
import { AssessmentModel } from '../assessment/assessment.model';
import { PlaylistModel } from '../playlist/playlist.model';

import * as papaparse from 'papaparse';
import * as _ from 'lodash';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import * as jsPDF from 'jspdf';

@Injectable()
export class ExporterEffects {
  // start export
  @Effect()
  startExport$: Observable<Action> = this.actions$
    .ofType<exporterActions.Start>(exporterActions.START)
    .pipe(
      debounceTime(1000),
      withLatestFrom(this.store),
      switchMap(([action, store]) => {
        const { stats, conversation } = store;
        // max concurrent requests
        const concurrency = 5;
        // assessment ids to export
        const assessmentIds = this.getIdsToExport(store);
        const conversationIds = assessmentIds.map(
          id => store.assessment.entities[id].conversationId
        );
        // queue next actions
        const nextActions = [
          new exporterActions.ExportIds(assessmentIds),
          new exporterActions.GotMissing(),
        ];
        // conversation ids that are missing from local store
        const missingIds = conversationIds.filter(
          id => !conversation.ids.includes(id)
        );
        if (missingIds.length) {
          // notify of download
          this.notifcationService.openSnackBar(
            `Downloading ${missingIds.length} missing conversations`
          );
          // create observable array of ids and pipe to them the operators
          return from(missingIds).pipe(
            // for each missingId, create a http request and then execute with max concurrency setting
            flatMap(id => this.createRequest(id, store.apiLogin), concurrency),
            // transform each response with ID
            map(response => this.utilityService.transformResponse(response)),
            // buffer size = amount of requests (wait for all before mapping to store)
            bufferCount(missingIds.length),
            // flatten array of arrays after buffer compelte
            map(conversations =>
              conversations.reduce((arr, curr) => [...arr, ...curr], [])
            ),
            // return next actions
            switchMap(conversations => [
              new conversationActions.AddMany(conversations),
              ...nextActions,
            ]),
            catchError(err => this.utilityService.handleError(err))
          );
        }
        return nextActions;
      })
    );

  // start export
  @Effect()
  buildGrids$: Observable<Action> = this.actions$
    .ofType<exporterActions.GotMissing>(exporterActions.GOT_MISSING)
    .pipe(
      withLatestFrom(this.store),
      map(([action, store]) => {
        const convFields = [
          'assessmentId',
          'createdBy',
          'conversationId',
          'eventKey',
          'text',
          'mcsRawScore',
          'agentId',
          'time',
          'note',
        ];
        const convGrid = this.buildConversationGrid(store);
        this.writeToTemplate(convGrid, convFields);
        return new exporterActions.Complete();
      })
    );

  constructor(
    private utilityService: UtilityService,
    private messagesService: MessagesService,
    private notifcationService: NotificationService,
    private http: HttpClient,
    private store: Store<StoreModel>,
    private actions$: Actions
  ) {}

  /**
   * finds the ids
   * if assessments are selected, export those
   * else if playlists are selected, export those
   * else export all
   * @param {StoreModel} store
   * @return {string[]}
   */
  getIdsToExport(store: StoreModel): string[] {
    const { assessment, stats } = store;
    const { assesmentFilter, assessmentSelect } = stats;
    if (assessmentSelect.length) {
      const ids = assessmentSelect.map(item => item.id);
      return assessmentSelect.map(item => item.id);
    } else if (assesmentFilter.length) {
      return assesmentFilter;
    } else {
      return assessment.ids;
    }
  }

  /**
   *
   * @param {StoreModel} store
   * @param {string[]} idsToExport
   */
  buildConversationGrid(store: StoreModel) {
    const { assessment, conversation, exporter } = store;
    const assessmentGrid = exporter.exportIds.reduce((prev, id) => {
      const currAssessment = assessment.entities[id];
      const { conversationId } = currAssessment;
      const currConversation = conversation.entities[conversationId];
      const { isChat } = currConversation;
      const currMessages = this.messagesService.updateMessageEvents(
        currConversation
      );
      const msgIdProp = this.messagesService.getMessageIdProp(
        currConversation.isChat
      );

      return [
        ...prev,
        ...currMessages.map(message => {
          const { time, mcsRawScore, eventKey } = message;
          return {
            assessmentId: id,
            createdBy: currAssessment.createdBy,
            conversationId,
            eventKey,
            time,
            mcsRawScore,
            text: this.messagesService.getMessageText(isChat, message),
            note: this.messagesService.getMessageNote(
              message[msgIdProp],
              currAssessment
            ),
          };
        }),
      ];
    }, []);
    return assessmentGrid;
  }

  /**
   * gets template file and writes new rows to worksheets
   * @param {any[]} rows
   * @param {any[]} header
   */
  writeToTemplate(rows: any[], header: any[]): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .get('/assets/template.xlsx', { headers, responseType: 'arraybuffer' })
      .subscribe(
        res => {
          const wb: XLSX.WorkBook = XLSX.read(res, { type: 'array' });
          const ws: XLSX.WorkSheet = wb.Sheets['Conversations'];
          XLSX.utils.sheet_add_json(ws, rows, { header });
          const date = new Date().toISOString().slice(0, 19);
          XLSX.writeFile(wb, `Assessments-${date}.xlsx`);
        },
        error => console.log(error)
      );
  }

  /**
   * gets conversations via http
   * @param {boolean} messagingMode
   * @param {ApiLoginModel} apiLogin
   * @return {string}
   */
  getUrl(messagingMode: boolean, apiLogin: ApiLoginModel): string {
    // url for a single conversation
    const { domains, account } = apiLogin;
    const { msgHist, engHistDomain } = domains;
    const domain = messagingMode ? msgHist : engHistDomain;
    return messagingMode
      ? `https://${domain}/messaging_history/api/account/${account}/conversations/conversation/search`
      : `https://${domain}/interaction_history/api/account/${account}/interaction/search`;
  }

  /**
   * create payload for request
   * @param {boolean} messagingMode
   * @param {string} id
   * @return {any}
   */
  getBody(messagingMode: boolean, id: string): any {
    const idKey = messagingMode ? 'conversationId' : 'engagementId';
    return { [idKey]: id };
  }

  /**
   * Create http post request
   * @param {string} id
   * @param {ApiLoginModel} apiLogin
   * @return {Observable<MsgHistResponse|EngHistResponse>}
   */
  createRequest(
    id: string,
    apiLogin: ApiLoginModel
  ): Observable<MsgHistResponse | EngHistResponse> {
    const messagingMode = id.includes('-');
    const url = this.getUrl(messagingMode, apiLogin);
    const body = this.getBody(messagingMode, id);
    const headers = this.utilityService.getHeaders(apiLogin.bearer);
    return this.http.post<MsgHistResponse | EngHistResponse>(url, body, {
      headers,
    });
  }

  /**
   * take collection of assessments or playlists
   * convert to xlsx and save
   * @param {string} type
   * @param {AssessmentModel[]|PlaylistModel[]}
   */
  downloadXlsxFile(
    type: string,
    rows: AssessmentModel[] | PlaylistModel[]
  ): void {
    if (!rows.length) {
      return;
    }
    // constants
    const name = type === 'assessments' ? 'Assessments' : 'Playlists';
    // create worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(rows);
    // create workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, name);
    // current timestamp
    const date = new Date().toISOString().slice(0, 19);
    // save to file
    XLSX.writeFile(wb, `${name}-${date}.xlsx`);
  }

  /**
   * export data to csv
   * @param {any[]} data
   */
  downloadCsvFile(data: any[], prefix: string = 'Data'): void {
    const csv = papaparse.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const date = new Date().toISOString().slice(0, 19);
    FileSaver.saveAs(blob, prefix + '-' + date + '.csv');
  }
}
