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
   * Calculates the weighted personality score
   * @return {string}
   */
  calculatePersonality(descriptors: AssessmentPersonalityModel[]): string {
    const score =
      (descriptors &&
        descriptors.reduce((prev, curr) => {
          return prev + curr.score;
        }, 0)) ||
      0;
    const personality = score / (descriptors.length * 5);
    return personality > 0 ? `+${personality}` : `${personality}`;
  }

  /**
   * calculates the percent score for each qa group/section
   * @param {AssessmentQaModel} group
   * @return {AssessmentQaGroupScore}
   */
  calculateQaGroupScore(group: AssessmentQaModel): AssessmentQaGroupScore {
    const { title, section, key } = group;
    const { sum, count } = section.reduce(
      (prev, curr) => {
        return {
          sum: prev.sum + curr.score,
          count: prev.count + (curr.score > 0 ? 1 : 0),
        };
      },
      {
        sum: 0,
        count: 0,
      }
    );
    return {
      title,
      key,
      score: sum / (count * 5),
    };
  }

  /**
   * calculates the total qa score
   * @param {AssessmentQaModel[]} qa
   * @return {AssessmentQaTotalScore}
   */
  calculateQaTotalScore(qa: AssessmentQaModel[]): AssessmentQaTotalScore {
    const { sum, count, group } = qa.reduce(
      (prev, curr) => {
        // get result for current group/section
        const { score, title, key } = this.calculateQaGroupScore(curr);
        // ignore 0 scores
        if (score) {
          return {
            // collect scores by group key
            group: {
              ...prev.group,
              [key]: { title, score }
            },
            sum: prev.sum + score,
            count: prev.count + 1,
          };
        }
        return prev;
      },
      { group: {}, sum: 0, count: 0 }
    );
    return {
      group,
      sum,
      count,
      score: sum / count || 0
    };
  }

  /**
   * aggregates the group scores to previous assessment group scores
   * @param {AssessmentQaGroupKey} prev
   * @param {AssessmentQaGroupKey} group
   * @return {AssessmentQaTotalScore}
   */
  aggregateQaGroupScore(prev: AssessmentQaGroupKey, group: AssessmentQaGroupKey): AssessmentQaGroupKey {
    // get keys of each assessment group/section
    const groupKeys = Object.keys(group);
    return groupKeys.reduce((p, key) => {
      const { score, title } = group[key];
      // ignore 0 scores
      if (score) {
        const sum = p[key] ? p[key].sum + score : score;
        const count = p[key] ? p[key].count + 1 : 1;
        return {
          ...p,
          [key]: {
            title,
            sum,
            count,
            score: sum / count || 0,
          },
        };
      }
      return p;
    }, prev);
  }

  /**
   * aggregate a series of qa asessments
   * @param {AssessmentQaTotalScore} prev
   * @param {AssessmentQaModel[]} qa
   * @return {AssessmentQaTotalScore}
   */
  aggregateQaTotal(prev: AssessmentQaTotalScore, qa: AssessmentQaModel[]): AssessmentQaTotalScore {
    const qaTotal = this.calculateQaTotalScore(qa);
    const { score, group } = qaTotal;
    // ignore 0 scores
    if (score) {
      const sum = prev.sum + score;
      const count = prev.count + 1;
      return {
        group: this.aggregateQaGroupScore(prev.group, group),
        sum,
        count,
        score: sum / count || 0,
      };
    }
    return prev;
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
    const dateFrom = new Date(now.setDate(now.getDate() - 7));
    const from: number = Math.round(dateFrom.getTime());
    const to: number = Math.round(dateTo.getTime());
    return { from, to };
  }

}
