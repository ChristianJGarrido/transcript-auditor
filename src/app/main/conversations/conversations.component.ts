import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ApiConversationHistoryRecord } from '../../shared/interfaces/interfaces';

// 3rd party
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit, OnChanges {
  @ViewChild('table') table: DatatableComponent;
  @Input() conversations: ApiConversationHistoryRecord[] = [];
  @Output() selectConversation = new EventEmitter<ApiConversationHistoryRecord>();

  rows: any[] = [];
  columns: any[] = [];

  constructor() {}

  /**
   * selects an individual conversation
   * @param {any} event
   */
  clickDatatable(event: any): void {
    if (event.type === 'click') {
      const conversation = this.conversations.find(record => record.info.conversationId === event.row.conversationId);
      if (conversation) {
        this.selectConversation.emit(conversation);
      }
    }
  }

  ngOnInit() {
    this.columns = [
      { prop: 'conversationId', name: 'ID', flexGrow: 1 },
      { prop: 'message', name: 'Message', flexGrow: 3 }
    ];
  }

  ngOnChanges() {
    if (this.conversations) {
      this.rows = this.conversations.map(conversation => {
        const message =
          conversation.messageRecords[0] &&
          conversation.messageRecords[0].messageData &&
          conversation.messageRecords[0].messageData.msg &&
          conversation.messageRecords[0].messageData.msg.text;
        return {
          conversationId: conversation.info && conversation.info.conversationId,
          message: message || ''
        };
      });
      this.table.bodyHeight = 400;
    }
  }
}
