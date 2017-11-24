import { Component, OnInit, Output, Input, EventEmitter, HostBinding } from '@angular/core';
import { ApiConversationHistoryRecord } from '../../shared/interfaces/interfaces';
import { ExportService } from '../../shared/services/export.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() conversation: ApiConversationHistoryRecord;
  @Output() nextConversation = new EventEmitter<boolean>();

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

  ngOnInit() {}
}
