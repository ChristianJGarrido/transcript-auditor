import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// interfaces
import { ApiData } from '../interfaces/interfaces';

// services
import { ApiLoginService } from './api-login.service';

@Injectable()
export class ApiDataService {
  apiData$: BehaviorSubject<ApiData> = new BehaviorSubject(null);

  constructor(private http: HttpClient, private apiLoginService: ApiLoginService) {
    this.apiLoginService.events$.subscribe(event => {
      if (event.isLoggedIn) {
        console.log('logged in!');
        this.getData();
      } else {
        console.log('logged out!');
      }
    });
  }

  /**
   * Get data from messaging history API
   */
  getData() {
    const url = `https://${this.apiLoginService.domains
      .msgHist}/messaging_history/api/account/${this.apiLoginService.user
      .account}/conversations/search`;
    const body = {
      start: {
        from: 1511108700000,
        to: 1511195100000
      }
    };
    const headers: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Authorization', 'Bearer ' + this.apiLoginService.bearer);
    const params: HttpParams = new HttpParams().set('limit', '20').set('offset', '0');
    this.http.post<any>(url, body, { headers, params }).subscribe(response => {
      console.log('Response: ', response);
      this.apiData$.next(response);
    });
  }
}
