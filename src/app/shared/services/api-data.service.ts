import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// interfaces
import { ApiData, ApiOptions, ApiIds } from '../interfaces/interfaces';

// services
import { ApiLoginService } from './api-login.service';

@Injectable()
export class ApiDataService {
  apiData$: BehaviorSubject<ApiData> = new BehaviorSubject(null);
  apiConversation$: BehaviorSubject<ApiData> = new BehaviorSubject(null);
  apiLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private apiLoginService: ApiLoginService) {
    this.apiLoginService.events$.subscribe(event => {
      if (event.isLoggedIn) {
        console.log('logged in!');
        this.getData();
      } else {
        console.log('logged out!');
        this.apiData$.next(null);
      }
    });
  }

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
   * Get data from messaging history API
   */
  getData(options?: ApiOptions, ids?: ApiIds) {
    // emit loading event
    this.apiLoading$.next(true);

    // if ids includes
    if (ids) {
      if (ids.conversationId) {
        this.getConversationById(ids.conversationId);
      }
    }

    // prepare URL
    const url = `https://${this.apiLoginService.domains.msgHist}/messaging_history/api/account/${
      this.apiLoginService.user.account
    }/conversations/search`;

    // get start
    let start: { from: number; to: number };
    if (options) {
      start = this.convertDateToMs(new Date(options.start.from), new Date(options.start.to));
      options.start = start;
    } else {
      const to = new Date();
      const dateTo = new Date(to.setDate(to.getDate() - 1));
      const dateFrom = new Date(to.setDate(to.getDate() - 7));
      start = this.convertDateToMs(dateFrom, dateTo);
    }

    // prepare body
    let body;
    if (options) {
      body = options;
    } else {
      body = { start };
    }

    // set headers
    const headers: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.apiLoginService.bearer);

    // set params
    const params: HttpParams = new HttpParams()
      .set('limit', '100')
      .set('offset', '0')
      .set('sort', 'start:desc');

    // make request
    this.http.post<ApiData>(url, body, { headers, params }).subscribe(
      response => {
        console.log('Response: ', response);
        this.apiData$.next(response);
        this.apiLoading$.next(false);
      },
      error => {
        this.apiData$.next(null);
        this.apiLoading$.next(false);
      }
    );
  }

  /**
   * method to get a single conversation from API
   * @param {string} conversationId
   */
  getConversationById(conversationId: string) {
    // emit loading event
    this.apiLoading$.next(true);

    // prepare URL
    const url = `https://${this.apiLoginService.domains.msgHist}/messaging_history/api/account/${
      this.apiLoginService.user.account
    }/conversations/conversation/search`;

    // prepare body
    const body = { conversationId };

    // set headers
    const headers: HttpHeaders = new HttpHeaders()
    .set('Content-Type', 'application/json')
    .set('Authorization', 'Bearer ' + this.apiLoginService.bearer);

    // make request
    this.http.post<ApiData>(url, body, { headers }).subscribe(
      response => {
        console.log('Conversation: ', response);
        this.apiConversation$.next(response);
        this.apiLoading$.next(false);
      },
      error => {
        this.apiLoading$.next(false);
      }
    );

  }
}
