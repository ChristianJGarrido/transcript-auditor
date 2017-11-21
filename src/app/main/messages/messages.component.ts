import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationHistoryRecord } from '../../shared/interfaces/interfaces';
import { ExportService } from '../../shared/services/export.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  @Input() conversation: ApiConversationHistoryRecord;

  constructor(private exportService: ExportService) {}

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

  ngOnInit() {}
}
