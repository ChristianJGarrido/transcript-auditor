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

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConversationModel } from '../../shared/store/conversation/conversation.model';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css']
})
export class ConversationsListComponent implements OnInit, OnChanges {
  @ViewChild('table') table: DatatableComponent;
  @Input() conversations: ConversationModel[] = [];
  @Output() selectConversation = new EventEmitter<ConversationModel>();

  rows = [];
  columns = [];

  constructor() {}

  /**
   * selects an individual conversation
   * @param {any} event
   */
  clickDatatable(event: any): void {
    // if (event.type === 'click') {
    //   const conversation = this.apiConversations.find(
    //     record => record.info.conversationId === event.row.conversationId
    //   );
    //   if (conversation) {
    //     this.selectConversation.emit(conversation);
    //   }
    // }
  }

  ngOnInit() {
    // set columns
    this.columns = [
      { prop: 'startTime', name: 'Start', flexGrow: 1, cellClass: 'datatable-cells' },
      { prop: 'message', name: 'Message', flexGrow: 3 }
    ];
  }

  ngOnChanges() {
    this.rows = this.conversations.slice(0);
  }
}
