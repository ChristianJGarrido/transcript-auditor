import { Injectable } from '@angular/core';
import {
  AssessmentPersonalityModel,
  AssessmentQaModel,
  AssessmentQaGroupModel,
  AssessmentQaGroupScore,
  AssessmentQaTotalScore,
  AssessmentQaGroupKey,
} from '../store/assessment/assessment.model';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { Action, Store } from '@ngrx/store';
import { NotificationService } from './notification.service';
import { StoreModel } from '../../app.store';
import * as apiLoginActions from '../../shared/store/api-login/api-login.actions';
import * as conversationActions from '../../shared/store/conversation/conversation.actions';
import { ConversationModel } from '../store/conversation/conversation.model';

@Injectable()
export class UtilityService {
  constructor(private notificationService: NotificationService, private store: Store<StoreModel>) {}

  /**
   * returns index of item in an array
   * @param {string} id
   * @param {any[]} items
   */
  findIndex(id: string, items: any[]): number {
    const index = items.indexOf(id);
    return index ? index : 0;
  }

  /**
   * Create headers
   * @param {string} token
   * @return {HttpHeaders}
   */
  getHeaders(token: string): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
  }

  /**
   * handles error from catchError
   * @param {HttpErrorResponse} error
   * @return {Observable<Action>}
   */
  handleError(error: HttpErrorResponse): Observable<Action> {
    const ERROR = { type: 'REQUEST_ERROR' };
    if (error.status === 401) {
      this.notificationService.openSnackBar('Session expired');
      this.store.dispatch(new apiLoginActions.NotAuthenticated(true));
    } else {
      const message = error.error && error.error.debugMessage;
      this.notificationService.openSnackBar(
        `Error: ${message || error.message}`
      );
    }
    return of(ERROR);
  }

  /**
   * transforms response items before adding to store
   * @param {any} response
   * @return {ConversationModel[]}
   */
  transformResponse(response: any): ConversationModel[] {
    const msgProp = 'conversationHistoryRecords';
    const chatProp = 'interactionHistoryRecords';
    const messagingMode = response[msgProp] ? true : false;
    const recordProp = messagingMode ? msgProp : chatProp;
    const idProp = messagingMode ? 'conversationId' : 'engagementId';
    const isChat = !messagingMode;
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
    dateTo.setHours(23, 59, 59, 999);
    const dateFrom = new Date(now.setDate(now.getDate() - 7));
    dateFrom.setHours(0, 0, 0, 0);
    const from: number = Math.round(dateFrom.getTime());
    const to: number = Math.round(dateTo.getTime());
    return { from, to };
  }

}
