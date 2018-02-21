import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { StoreModel } from '../app.store';
import * as ApiLoginActions from '../shared/store/api-login/api-login.actions';
import * as fromConversation from '../shared/store/conversation/conversation.reducer';
import { ConversationModel } from '../shared/store/conversation/conversation.model';
import { ApiLoginModel } from '../shared/store/api-login/api-login.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  apiLogin$: Observable<ApiLoginModel>;
  conversations$: Observable<ConversationModel[]>;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit(): void {
    this.store.dispatch(new ApiLoginActions.GetSession());
    this.apiLogin$ = this.store.select(state => state.apiLogin);
    this.conversations$ = this.store.select(fromConversation.selectAll);
  }

  ngAfterViewInit(): void {}
}
