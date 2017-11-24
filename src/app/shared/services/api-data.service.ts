import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// interfaces
import { ApiData, ApiOptions, ApiIds } from '../interfaces/interfaces';

// services
import { ApiLoginService } from './api-login.service';

@Injectable()
export class ApiDataService {
  apiConversations$: BehaviorSubject<ApiData> = new BehaviorSubject(null);
  apiConversation$: BehaviorSubject<ApiData> = new BehaviorSubject(null);
  apiLoading$: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpClient, private apiLoginService: ApiLoginService) {
    this.apiLoginService.events$.subscribe(event => {
      if (event.isLoggedIn) {
        if (!environment.production) {
          console.log('logged in!');
        }
        this.getData();
      } else {
        if (!environment.production) {
          console.log('logged out!');
        }
        this.apiConversations$.next(null);
        this.apiConversation$.next(null);
      }
    });
  }

  /**
   * @return {HttpHeaders}
   */
  private _getHeaders(): HttpHeaders {
    return new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.apiLoginService.bearer);
  }

  /**
   * helper method to calculate ms from dates
   * @return {number, number}
   */
  private _convertDateToMs(dateFrom: Date, dateTo: Date): { from: number; to: number } {
    const from: number = Math.round(dateFrom.getTime());
    const to: number = Math.round(dateTo.getTime());
    return { from, to };
  }

  /**
   * Helper to initiate http requests
   * @param {boolean} all true if all conversations (false if 1 conversation)
   * @param {string} url
   * @param {any} body
   * @param {headers, params}
   */
  private _httpRequest(all: boolean, url: string, body: any, { headers, params }) {
    const options = all ? { headers, params } : { headers };
    this.http.post<ApiData>(url, body, options).subscribe(
      response => {
        if (!environment.production) {
          console.log('Response: ', response);
        }
        if (all) {
          this.apiConversations$.next(response);
        } else {
          this.apiConversation$.next(response);
        }
        this.apiLoading$.next(false);
      },
      error => {
        if (error.status === 401) {
          if (all) {
            this.apiConversations$.next(null);
          } else {
            this.apiConversation$.next(null);
          }
          this.apiLoginService.manageEvents();
        }

        this.apiLoading$.next(false);
      }
    );
  }

  /**
   * Get data from messaging history API
   */
  getData(options?: ApiOptions, ids?: ApiIds) {
    // emit loading event
    this.apiLoading$.next(true);
    // if ids include
    if (ids && ids.conversationId) {
      this.getConversationById(ids.conversationId);
    }
    // prepare URL
    const url = `https://${this.apiLoginService.domains.msgHist}/messaging_history/api/account/${
      this.apiLoginService.user.account
    }/conversations/search`;
    // get start
    let start: { from: number; to: number };
    if (options) {
      start = this._convertDateToMs(new Date(options.start.from), new Date(options.start.to));
      options.start = start;
    } else {
      const to = new Date();
      const dateTo = new Date(to.setDate(to.getDate() - 1));
      const dateFrom = new Date(to.setDate(to.getDate() - 7));
      start = this._convertDateToMs(dateFrom, dateTo);
    }
    // prepare body
    const body = options ? options : { start };
    // set headers
    const headers = this._getHeaders();
    // set params
    const params: HttpParams = new HttpParams()
      .set('limit', '100')
      .set('offset', '0')
      .set('sort', 'start:desc');
    // make request
    this._httpRequest(true, url, body, { headers, params });
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
    const headers = this._getHeaders();
    // make request
    this._httpRequest(false, url, body, { headers, params: null });
  }
}
