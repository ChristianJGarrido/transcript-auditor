import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { ApiConversationHistoryRecord, ApiOptions } from '../../shared/interfaces/interfaces';

// 3rd party
import { DatatableComponent } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css']
})
export class ConversationsListComponent implements OnInit, OnChanges {
  @ViewChild('table') table: DatatableComponent;
  @Input() apiConversations: ApiConversationHistoryRecord[] = [];
  @Input() count: number;
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
      const conversation = this.apiConversations.find(
        record => record.info.conversationId === event.row.conversationId
      );
      if (conversation) {
        this.selectConversation.emit(conversation);
      }
    }
  }

  ngOnInit() {
    // set columns
    this.columns = [
      { prop: 'startTime', name: 'Start', flexGrow: 1, cellClass: 'datatable-cells' },
      { prop: 'message', name: 'Message', flexGrow: 3 }
    ];
  }

  ngOnChanges() {
    if (this.apiConversations) {
      // update rows when conversations change
      this.rows = this.apiConversations.map(conversation => {
        const message =
          conversation.messageRecords[0] &&
          conversation.messageRecords[0].messageData &&
          conversation.messageRecords[0].messageData.msg &&
          conversation.messageRecords[0].messageData.msg.text;
        return {
          ...conversation.info,
          startTime: conversation.info && conversation.info.startTime.substr(0, 10),
          message: message || ''
        };
      });
    }
  }
}
