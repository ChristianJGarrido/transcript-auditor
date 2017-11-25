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

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversation: ApiConversationHistoryRecord;
  @Output() nextConversation = new EventEmitter<boolean>();

  messageEvents: any[] = [];

  constructor(private exportService: ExportService) {}

  /**
   * Download message data to CSV
   */
  downloadCsv() {
    // prepare message records
    const messages = this.conversation.messageRecords.map(record => {
      return {
        sentBy: record.sentBy,
        time: record.time,
        device: record.device,
        text: record.messageData && record.messageData.msg && record.messageData.msg.text
      };
    });
    this.exportService.downloadCsvFile(messages);
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
    if (!this.conversation || !this.conversation.messageRecords) {
      return [];
    }

    // combine all events
    const events = [
      ...this.conversation.messageRecords.map(item => ({ ...item, key: item.type })),
      ...this.conversation.agentParticipants.map(item => ({ ...item, key: 'PARTICIPANT' })),
      ...this.conversation.transfers.map(item => ({ ...item, key: 'TRANSFER' })),
      // ...this.conversation.interactions.map(item => ({
      //   ...item,
      //   timeL: item.interactionTimeL,
      //   key: 'INTERACTION'
      // }))
    ];

    return _.orderBy(events, 'timeL', 'asc');
  }

  ngOnInit() {}

  ngOnChanges() {
    this.messageEvents = this.prepareMessageEvents();
  }
}
