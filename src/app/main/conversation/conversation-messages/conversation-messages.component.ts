import {
  Component,
  OnInit,
  Output,
  Input,
  HostBinding,
  OnChanges,
} from '@angular/core';
import {
  ApiConversationHistoryRecord,
  ApiConversationAgentParticipants,
  ApiConversationConsumerParticipants,
  ApiConversationMessageRecord,
  ApiConversationTransfers,
  MessageEvent,
} from '../../../shared/interfaces/interfaces';
import { UtilityService } from '../../../shared/services/utility.service';
import * as fromConversation from '../../../shared/store/conversation/conversation.reducer';
import { AssessmentModel } from '../../../shared/store/assessment/assessment.model';

import * as _ from 'lodash';
import { WatsonService } from '../../../shared/services/watson.service';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';

@Component({
  selector: 'app-conversation-messages',
  templateUrl: './conversation-messages.component.html',
  styleUrls: ['./conversation-messages.component.css'],
})
export class ConversationMessagesComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversationState: fromConversation.State;
  @Input() conversationIds: any[];
  @Input() conversationPlaylistIds: any[];
  @Input() conversationSelect: any;
  @Input() assessmentSelect: AssessmentModel;
  @Input() playlistSelect: PlaylistModel;

  messageEvents: any[] = [];

  constructor(
    private utilityService: UtilityService,
    private watsonService: WatsonService
  ) {}

  // returns conversation ids
  getIds(): any[] {
    if (this.conversationPlaylistIds.length) {
      return this.conversationPlaylistIds;
    }
    return this.conversationIds;
  }

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(
      this.conversationSelect.id,
      this.getIds()
    );
  }

  /**
   * Analyse messages with Watson API
   */
  analyseMessages() {
    const messages = this.messageEvents
      .filter(message => {
        return message.eventKey === 'MESSAGE' && message.sentBy === 'Consumer';
      })
      .map(
        message =>
          message.messageData &&
          message.messageData.msg &&
          message.messageData.msg.text
      );
    this.watsonService.analyseMessages(messages);
  }

  /**
   * Function to recreate time series of message events
   */
  prepareMessageEvents(): any[] {
    // proceed only if we have data
    if (!this.conversationSelect || !this.conversationSelect.messageRecords) {
      return [];
    }

    // combine all events
    const events = [
      ...this.conversationSelect.messageRecords.map(item => ({
        ...item,
        eventKey: 'MESSAGE',
      })),
      ...this.conversationSelect.agentParticipants.map(item => ({
        ...item,
        eventKey: 'PARTICIPANT',
      })),
      ...this.conversationSelect.transfers.map(item => ({
        ...item,
        eventKey: 'TRANSFER',
      })),
      // ...this.conversation.interactions.map(item => ({
      //   ...item,
      //   timeL: item.interactionTimeL,
      //   eventKey: 'INTERACTION'
      // }))
    ];

    return _.orderBy(events, 'timeL', 'asc');
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.messageEvents = this.prepareMessageEvents();
  }
}
