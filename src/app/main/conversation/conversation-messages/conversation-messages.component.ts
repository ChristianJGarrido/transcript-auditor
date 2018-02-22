import {
  Component,
  OnInit,
  Output,
  Input,
  HostBinding,
  OnChanges
} from '@angular/core';
import {
  ApiConversationHistoryRecord,
  ApiConversationAgentParticipants,
  ApiConversationConsumerParticipants,
  ApiConversationMessageRecord,
  ApiConversationTransfers,
  MessageEvent
} from '../../../shared/interfaces/interfaces';
import { ExportService } from '../../../shared/services/export.service';
import { UtilityService } from '../../../shared/services/utility.service';

// 3rd party
import * as _ from 'lodash';
import { WatsonService } from '../../../shared/services/watson.service';

@Component({
  selector: 'app-conversation-messages',
  templateUrl: './conversation-messages.component.html',
  styleUrls: ['./conversation-messages.component.css']
})
export class ConversationMessagesComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversations: any[];
  @Input() conversationSelect: any;

  messageEvents: any[] = [];

  constructor(
    private utilityService: UtilityService,
    private exportService: ExportService,
    private watsonService: WatsonService
  ) {}

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(this.conversationSelect.id, this.conversations);
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
   * Download message data to CSV
   */
  downloadCsv() {
    // prepare message records
    const messages = this.messageEvents.map(event => {
      return {
        event: event.eventKey,
        sentBy: event.sentBy,
        agentFullName: event.agentFullName,
        time: event.time,
        text:
          event.messageData &&
          event.messageData.msg &&
          event.messageData.msg.text
      };
    });
    this.exportService.downloadCsvFile(messages, 'Conversation');
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
        eventKey: 'MESSAGE'
      })),
      ...this.conversationSelect.agentParticipants.map(item => ({
        ...item,
        eventKey: 'PARTICIPANT'
      })),
      ...this.conversationSelect.transfers.map(item => ({
        ...item,
        eventKey: 'TRANSFER'
      }))
      // ...this.conversation.interactions.map(item => ({
      //   ...item,
      //   timeL: item.interactionTimeL,
      //   eventKey: 'INTERACTION'
      // }))
    ];

    return _.orderBy(events, 'timeL', 'asc');
  }

  ngOnInit() {}

  ngOnChanges() {
    this.messageEvents = this.prepareMessageEvents();
  }
}
