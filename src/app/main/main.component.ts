import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subscription } from 'rxjs/Subscription';

// components
import { ModalComponent } from './modal/modal.component';

// interfaces
import { AfUser, ApiData, ApiConversationHistoryRecord } from '../shared/interfaces/interfaces';

// material
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

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
  apiConversationSub: Subscription;
  afData$: Observable<AfUser>;

  // properties
  conversation: ApiConversationHistoryRecord;
  conversations: ApiConversationHistoryRecord[] = [];

  // ref
  dialogRef: MatDialogRef<ModalComponent>;

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
    // select first conversation if none selected
    if (!this.conversation || (!this.conversation.info && this.conversations.length > 0)) {
      this.conversation = this.conversations[0];
      return;
    }

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
    } else {
      this.conversation = this.conversations[0];
    }
  }

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(ModalComponent, { maxWidth: 400 });
  }

  ngOnInit() {
    // setup stream from angularFire
    this.afData$ = this.afDataService.afData$;

    // setup stream for api data
    this.apiDataSub = this.apiDataService.apiData$.subscribe(data => {
      this.conversations = data ? data.conversationHistoryRecords : [];

      // after data is collected, get first conversation
      if (!this.conversation && this.conversations.length > 0) {
        this.conversation = this.conversations[0];
      }
    });

    // setup stream for individual api conversation
    this.apiConversationSub = this.apiDataService.apiConversation$.subscribe(data => {
      this.conversation =
        data && data.conversationHistoryRecords && data.conversationHistoryRecords[0]
          ? data.conversationHistoryRecords[0]
          : null;
    });

    // open dialog on login if no token found
    // timeout required due to known angular bug with opening dialog during change detection
    if (!this.apiLoginService.bearer) {
      setTimeout(() => this.openDialog(), 100);
    }
  }

  ngOnDestroy() {
    this.apiDataSub.unsubscribe();
  }
}
