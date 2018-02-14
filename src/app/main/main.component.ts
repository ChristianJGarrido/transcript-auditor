import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';
import {
  AfUser,
  ApiConversationHistoryRecord,
  AfConversationData,
} from '../shared/interfaces/interfaces';
import { Store } from '@ngrx/store';
import { StoreModel } from '../app.store';
import * as ApiLoginActions from '../shared/store/api-login/api-login.actions';
import { ApiDataModel } from '../shared/store/api-data/api-data.model';
import { AfLoginModel } from '../shared/store/af-login/af-login.model';
import { AfDataModel } from '../shared/store/af-data/af-data.model';
import { ApiLoginModel } from '../shared/store/api-login/api-login.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  afLogin$: Observable<AfLoginModel>;
  afData$: Observable<AfDataModel>;
  apiLogin$: Observable<ApiLoginModel>;
  apiData$: Observable<ApiDataModel>;

  constructor(private store: Store<StoreModel>) {}

  /**
   * assigns conversation property from event emission
   * @param {ApiConversationHistoryRecord} conversation
   */
  selectConversation(conversation: ApiConversationHistoryRecord) {
    // this.apiConversation = conversation;
  }

  ngOnInit(): void {
    this.store.dispatch(new ApiLoginActions.GetSession());
    this.afLogin$ = this.store.select(state => state.afLogin);
    this.afData$ = this.store.select(state => state.afData);
    this.apiLogin$ = this.store.select(state => state.apiLogin);
    this.apiData$ = this.store.select(state => state.apiData);
  }

  ngAfterViewInit(): void {}
}
