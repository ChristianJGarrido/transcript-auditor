import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpResponse,
  HttpParams
} from '@angular/common/http';

declare var NaturalLanguageUnderstandingV1: any;

@Injectable()
export class WatsonService {
  constructor(private http: HttpClient) {}

  analyseMessages(messages: string[]) {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    this.http.post('/api/watson/analyse', { messages }, { headers }).subscribe(
      response => {
        console.log(response);
      },
      err => console.log(err)
    );
  }
}
