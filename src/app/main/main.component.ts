import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

// components
import { ModalComponent } from './modal/modal.component';

// interfaces
import {
  AfConversations,
  ApiData,
  ApiConversationHistoryRecord
} from '../shared/interfaces/interfaces';

// material
import { MatDialog } from '@angular/material';

// services
import { AfDataService } from '../shared/services/af-data.service';
import { ApiLoginService } from '../shared/services/api-login.service';
import { ApiDataService } from '../shared/services/api-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy {
  // subscripitions & observables
  apiDataSub: Subscription;
  afData$: Observable<AfConversations>;

  // properties
  conversation: ApiConversationHistoryRecord;
  conversations: ApiConversationHistoryRecord[] = [];

  constructor(
    public dialog: MatDialog,
    private afDataService: AfDataService,
    private apiDataService: ApiDataService,
    private apiLoginService: ApiLoginService
  ) {}

  /**
   * assigns conversation property from event emission
   * @param {ApiConversationHistoryRecord} conversation
   */
  getConversation(conversation: ApiConversationHistoryRecord) {
    this.conversation = conversation;
  }

  /**
   * toggle through conversations (true is forward, false is back)
   * @param {boolean} next
   */
  cycleConversations(next: boolean) {

    // find current index
    const index = this.conversations.findIndex(
      conversation => conversation.info.conversationId === this.conversation.info.conversationId
    );

    // find new index
    if (index !== -1) {
      const length = this.conversations.length;
      let targetIndex;
      if (next && index + 1 === length) {
        targetIndex = 0;
      } else if (!next && index - 1 === -1) {
        targetIndex = length - 1;
      } else {
        targetIndex = next ? index + 1 : index - 1;
      }

      // set new conversation
      this.conversation = this.conversations[targetIndex];
    }
  }

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialog.open(ModalComponent, { maxWidth: 400 });
  }

  ngOnInit() {
    // stream from angularFire
    this.afData$ = this.afDataService.afData$;

    // stream from api
    this.apiDataSub = this.apiDataService.apiData$.subscribe(data => {
      this.conversations = data ? data.conversationHistoryRecords : [];
    });

    if (!this.apiLoginService.bearer) {
      this.openDialog();
    }
  }

  ngOnDestroy() {
    this.apiDataSub.unsubscribe();
  }
}
