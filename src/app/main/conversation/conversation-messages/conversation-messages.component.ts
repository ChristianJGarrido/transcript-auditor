import {
  Component,
  OnInit,
  Output,
  Input,
  HostBinding,
  OnChanges,
} from '@angular/core';
import { UtilityService } from '../../../shared/services/utility.service';
import * as fromConversation from '../../../shared/store/conversation/conversation.reducer';
import { AssessmentModel } from '../../../shared/store/assessment/assessment.model';

import * as _ from 'lodash';
import { WatsonService } from '../../../shared/services/watson.service';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import {
  ConversationChatModel,
  ConversationMessageModel,
  ConversationModel,
} from '../../../shared/store/conversation/conversation.model';

@Component({
  selector: 'app-conversation-messages',
  templateUrl: './conversation-messages.component.html',
  styleUrls: ['./conversation-messages.component.css'],
})
export class ConversationMessagesComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversationState: fromConversation.State;
  @Input() conversationSelect: any;
  @Input() assessmentSelect: AssessmentModel;
  @Input() playlistSelect: PlaylistModel;

  messageEvents = [];

  constructor(
    private utilityService: UtilityService,
    private watsonService: WatsonService
  ) {}

  // returns conversation ids
  getIds(): any[] {
    if (this.conversationState.playlistIds.length) {
      return this.conversationState.playlistIds;
    }
    return this.conversationState.ids;
  }

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(
      this.conversationSelect.id,
      this.getIds()
    );
  }

  // get conversation type
  getType(): string {
    return this.conversationSelect.isChat ? 'Chat' : 'Conversation';
  }

  // get conversation id
  getId(): string {
    const { isChat } = this.conversationSelect;
    const param = isChat ? 'engagementId' : 'conversationId';
    return this.conversationSelect.info[param];
  }

  // get consumer id
  getConId(): string {
    const { isChat } = this.conversationSelect;
    return isChat
      ? this.conversationSelect.info.visitorId
      : this.conversationSelect.consumerParticipants[0].participantId;
  }

  // sort chat events
  prepareChatEvents(conversationChat: ConversationChatModel): any[] {
    // proceed only if we have data
    if (!conversationChat || !conversationChat.transcript.lines) {
      return [];
    }
    return conversationChat.transcript.lines.map(item => {
      return {
        ...item,
        eventKey: 'MESSAGE',
      };
    });
  }

  // sort conversation message events
  prepareMessageEvents(conversationMessage: ConversationMessageModel): any[] {
    // proceed only if we have data
    if (!conversationMessage || !conversationMessage.messageRecords) {
      return [];
    }
    // combine all events
    const events = [
      ...conversationMessage.messageRecords.map(item => ({
        ...item,
        eventKey: 'MESSAGE',
      })),
      ...conversationMessage.agentParticipants.map(item => ({
        ...item,
        eventKey: 'PARTICIPANT',
      })),
      ...conversationMessage.transfers.map(item => ({
        ...item,
        eventKey: 'TRANSFER',
      })),
    ];
    return _.orderBy(events, 'timeL', 'asc');
  }

  // update message events according to type
  updateMessageEvents(): any[] {
    const { isChat } = this.conversationSelect;
    return isChat
      ? this.prepareChatEvents(this.conversationSelect)
      : this.prepareMessageEvents(this.conversationSelect);
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.messageEvents = this.updateMessageEvents();
  }
}
