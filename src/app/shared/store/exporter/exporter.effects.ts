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
import * as html2canvas from 'html2canvas';
import { QaService } from '../../services/qa.service';
import { ExportGrids, ExportFields } from './exporter.model';

@Injectable()
export class ExporterEffects {
  // create pdf
  @Effect({ dispatch: false })
  createPdf$: Observable<Action> = this.actions$
    .ofType<exporterActions.CreatePdf>(exporterActions.CREATE_PDF)
    .pipe(
      map(action => {
        const { element } = action;
        // save element height and make 100% for canvas
        const original = element.style.height;
        element.style.height = '100%';
        html2canvas(element).then(canvas => {
          const img = canvas.toDataURL('image/png');

          const imgWidth = 210;
          const pageHeight = 295;
          const imgHeight = canvas.height * imgWidth / canvas.width;
          let heightLeft = imgHeight;

          const doc = new jsPDF('p', 'mm');
          let position = 0;

          doc.addImage(img, 'PNG', 5, position, imgWidth - 5, imgHeight);
          heightLeft -= pageHeight;

          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            doc.addPage();
            doc.addImage(img, 'PNG', 5, position, imgWidth - 5, imgHeight);
            heightLeft -= pageHeight;
          }
          const date = new Date().toISOString().slice(0, 19);
          doc.save(`Conversation-${date}.pdf`);
          // revert dom element to original size
          element.style.height = original;
        });
        return null;
      })
    );

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
        const fields = new ExportFields();
        const grids = this.buildGrids(store);
        this.writeToTemplate(grids, fields);
        return new exporterActions.Complete();
      })
    );

  constructor(
    private utilityService: UtilityService,
    private qaService: QaService,
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
   * builds the grids for export
   * @param {StoreModel} store
   * @param {string[]} idsToExport
   * @return {ExportGrids}
   */
  buildGrids(store: StoreModel): ExportGrids {
    const { assessment, conversation, exporter, list } = store;
    // iterate over each assessment to be exported
    const grids = exporter.assessmentIds.reduce((prev, id) => {
      // pick the assessment from the store
      const currAssessment = assessment.entities[id];
      // pick the conversation from the store
      const {
        conversationId,
        qa,
        note,
        recommend,
        rating,
        createdBy,
      } = currAssessment;
      const currConversation = conversation.entities[conversationId];
      const { isChat } = currConversation;
      // get the qa scores
      const { score, group } = this.qaService.calculateQaTotalScore(qa);
      const sScore = group.botSet && group.botSet.score;
      const uScore = group.botUnderstand && group.botUnderstand.score;
      const rScore = group.botRelay && group.botRelay.score;
      const aScore = group.botAchieve && group.botAchieve.score;
      // create assessment grid
      const assessments = [
        ...prev.assessments,
        {
          assessmentId: id,
          createdBy,
          conversationId,
          isChat,
          rating,
          note,
          recommend,
          suraScore: score,
          sScore,
          uScore,
          rScore,
          aScore,
        },
      ];
      // process messages and create conversation grid
      const currMessages = this.messagesService.getEvents(currConversation);
      const msgIdProp = this.messagesService.getMessageIdProp(isChat);
      const agentIdProp = this.messagesService.getAgentIdProp(isChat);
      const conversations = [
        ...prev.conversations,
        ...currMessages.map((message, sequence) => {
          const { time, mcsRawScore, eventKey } = message;
          const agentId = message[agentIdProp];
          const agent = list.agents.entities[agentId];
          const sentBy =
            eventKey === 'MESSAGE'
              ? this.messagesService.getSource(isChat, message)
              : '';
          const sentName = agent ? agent.fullName : agentId;
          const userType =
            !isChat && sentBy === 'agent'
              ? this.messagesService.getUserType(agentId, currConversation)
              : '';
          return {
            assessmentId: id,
            createdBy,
            conversationId,
            isChat,
            eventKey,
            sequence,
            time,
            mcsRawScore,
            sentBy,
            userType,
            sentName,
            text: this.messagesService.getMessageText(isChat, message),
            note: this.messagesService.getMessageNote(
              message[msgIdProp],
              currAssessment
            ),
          };
        }),
      ];

      return { conversations, assessments };
    }, new ExportGrids());
    return grids;
  }

  /**
   * gets template file and writes new rows to worksheets
   * @param {any[]} rows
   * @param {any[]} header
   */
  writeToTemplate(grids: ExportGrids, fields: ExportFields): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http
      .get('/assets/template.xlsx', { headers, responseType: 'arraybuffer' })
      .subscribe(
        res => {
          const wb: XLSX.WorkBook = XLSX.read(res, { type: 'array' });
          const wsConv: XLSX.WorkSheet = wb.Sheets['Conversations'];
          const wsAssess: XLSX.WorkSheet = wb.Sheets['Assessments'];
          XLSX.utils.sheet_add_json(wsConv, grids.conversations, {
            header: fields.conversation,
          });
          XLSX.utils.sheet_add_json(wsAssess, grids.assessments, {
            header: fields.assessment,
          });
          const date = new Date().toISOString().slice(0, 19);
          XLSX.writeFile(wb, `AssessmentsExport-${date}.xlsx`);
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
      : `https://${domain}/interaction_history/api/account/${account}/interactions/search`;
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
