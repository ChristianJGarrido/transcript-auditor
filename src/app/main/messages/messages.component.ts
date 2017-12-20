import {
  Component,
  OnInit,
  Output,
  Input,
  EventEmitter,
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
} from '../../shared/interfaces/interfaces';
import { ExportService } from '../../shared/services/export.service';

// 3rd party
import * as _ from 'lodash';
import { WatsonService } from '../../shared/services/watson.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() apiConversation: ApiConversationHistoryRecord;
  @Output() nextConversation = new EventEmitter<boolean>();

  messageEvents: any[] = [];

  constructor(
    private exportService: ExportService,
    private watsonService: WatsonService
  ) {}

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
   * toggle through conversations (true is forward, false is back)
   * @param {boolean} next
   */
  cycleConversations(next: boolean) {
    this.nextConversation.emit(next);
  }

  /**
   * Function to recreate time series of message events
   */
  prepareMessageEvents(): any[] {
    // proceed only if we have data
    if (!this.apiConversation || !this.apiConversation.messageRecords) {
      return [];
    }

    // combine all events
    const events = [
      ...this.apiConversation.messageRecords.map(item => ({
        ...item,
        eventKey: 'MESSAGE'
      })),
      ...this.apiConversation.agentParticipants.map(item => ({
        ...item,
        eventKey: 'PARTICIPANT'
      })),
      ...this.apiConversation.transfers.map(item => ({
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
