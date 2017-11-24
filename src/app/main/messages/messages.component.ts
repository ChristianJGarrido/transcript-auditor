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

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversation: ApiConversationHistoryRecord;
  @Output() nextConversation = new EventEmitter<boolean>();

  messageEvents: MessageEvent[] = [];

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
  prepareMessageEvents(): MessageEvent[] {

    // proceed only if we have data
    if (!this.conversation || !this.conversation.messageRecords) {
      return [];
    }
    const messageEvents: MessageEvent[] = [];

    // iterate over each message
    this.conversation.messageRecords.forEach((message, index, messages) => {
      // place the current message in first
      messageEvents.push({ type: message.type, message });

      // push participant events
      this.conversation.agentParticipants.forEach(participant => {
        if (
          participant.timeL >= message.timeL &&
          (index === messages.length - 1 || participant.timeL <= messages[index + 1].timeL)
        ) {
          messageEvents.push({ type: 'PARTICIPANT', participant });
        }
      });

      // push interactions events
      // this.conversation.interactions.forEach(interaction => {
      //   if (
      //     interaction.interactionTimeL >= message.timeL &&
      //     (index === messages.length - 1 || interaction.interactionTimeL <= messages[index + 1].timeL)
      //   ) {
      //     messageEvents.push({ type: 'INTERACTION', interaction });
      //   }
      // });

      // push transfer events
      this.conversation.transfers.forEach(transfer => {
        if (
          transfer.timeL >= message.timeL &&
          (index === messages.length - 1 || transfer.timeL <= messages[index + 1].timeL)
        ) {
          messageEvents.push({ type: 'TRANSFER', transfer });
        }
      });
    });

    return messageEvents;
  }

  ngOnInit() {}

  ngOnChanges() {
    this.messageEvents = this.prepareMessageEvents();
  }
}
