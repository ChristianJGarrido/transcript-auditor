import { Component, OnInit, OnDestroy, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { AfUser, ApiConversationHistoryRecord } from '../shared/interfaces/interfaces';
import { AfDataService } from '../shared/services/af-data.service';
import { ApiDataService } from '../shared/services/api-data.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit, OnDestroy, AfterViewInit {
  // subscripitions & observables
  apiConversationsSub: Subscription;
  apiConversationSub: Subscription;
  afData$: Observable<AfUser>;

  // properties
  conversation: ApiConversationHistoryRecord;
  conversations: ApiConversationHistoryRecord[] = [];
  count: number;

  constructor(private afDataService: AfDataService, private apiDataService: ApiDataService) {}

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

  ngOnInit() {
    // setup stream from angularFire
    this.afData$ = this.afDataService.afData$;

    // setup stream for api data
    this.apiConversationsSub = this.apiDataService.apiConversations$.subscribe(data => {
      this.conversations = data ? data.conversationHistoryRecords : [];
      this.count = data ? data._metadata && data._metadata.count : 0;

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
  }

  ngAfterViewInit() {
    // when window resizes, extend container height
    const resize = (window.onresize = () => {
      let windowHeight = 0;

      // get heights
      if (typeof window.innerWidth === 'number') {
        // Non-IE
        windowHeight = window.innerHeight || 0;
      }

      // calculate heights
      const conversationHeight = windowHeight < 790 ? 790 : windowHeight;
      const messagesHeight = conversationHeight - 200;
      const messagesScrollHeight = messagesHeight - 115;
      const formHeight = conversationHeight - 285;

      // set heights
      if (document.getElementById('conversations-container')) {
        document.getElementById('conversations-container').style.height =
          String(conversationHeight) + 'px';
      }
      if (document.getElementById('messages-container')) {
        document.getElementById('messages-container').style.height = String(messagesHeight) + 'px';
      }
      if (document.getElementById('messages-scroll-container')) {
        document.getElementById('messages-scroll-container').style.height =
          String(messagesScrollHeight) + 'px';
      }
      if (document.getElementById('form-container')) {
        document.getElementById('form-container').style.height = String(formHeight) + 'px';
      }
    });

    resize();
  }

  ngOnDestroy() {
    this.apiConversationsSub.unsubscribe();
    this.apiConversationSub.unsubscribe();
  }
}
