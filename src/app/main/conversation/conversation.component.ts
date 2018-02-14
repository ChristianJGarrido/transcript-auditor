import { Component, OnInit } from '@angular/core';
import {
  ApiConversationHistoryRecord,
  AfConversationData,
} from '../../shared/interfaces/interfaces';
import { Observable } from 'rxjs/Observable';
import { AfLoginModel } from '../../shared/store/af-login/af-login.model';
import { AfDataModel } from '../../shared/store/af-data/af-data.model';
import { ApiLoginModel } from '../../shared/store/api-login/api-login.model';
import { ApiDataModel } from '../../shared/store/api-data/api-data.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
})
export class ConversationComponent implements OnInit {
  afLogin$: Observable<AfLoginModel>;
  afData$: Observable<AfDataModel>;
  apiLogin$: Observable<ApiLoginModel>;
  apiData$: Observable<ApiDataModel>;

  constructor(private store: Store<StoreModel>) {}

  /**
   * toggle through conversations (true is forward, false is back)
   * @param {boolean} next
   */
  cycleConversations(next: boolean) {
    // // select first conversation if none selected
    // if (
    //   !this.apiConversation ||
    //   (!this.apiConversation.info && this.apiConversations.length > 0)
    // ) {
    //   this.apiConversation = this.apiConversations[0];
    //   return;
    // }

    // // find current index
    // const index = this.apiConversations.findIndex(
    //   conversation =>
    //     conversation.info.conversationId ===
    //     this.apiConversation.info.conversationId
    // );

    // // find new index
    // if (index !== -1) {
    //   const length = this.apiConversations.length;
    //   let targetIndex;
    //   if (next && index + 1 === length) {
    //     targetIndex = 0;
    //   } else if (!next && index - 1 === -1) {
    //     targetIndex = length - 1;
    //   } else {
    //     targetIndex = next ? index + 1 : index - 1;
    //   }

    //   // set new conversation
    //   this.apiConversation = this.apiConversations[targetIndex];
    // } else {
    //   this.apiConversation = this.apiConversations[0];
    // }
  }

  ngOnInit() {
    this.afLogin$ = this.store.select(state => state.afLogin);
    this.afData$ = this.store.select(state => state.afData);
    this.apiLogin$ = this.store.select(state => state.apiLogin);
    this.apiData$ = this.store.select(state => state.apiData);
  }
}
