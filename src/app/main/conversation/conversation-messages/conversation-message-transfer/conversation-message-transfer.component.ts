import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationTransfers } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-message-transfer',
  templateUrl: './conversation-message-transfer.component.html',
  styleUrls: ['./conversation-message-transfer.component.css']
})
export class ConversationMessageTransferComponent implements OnInit {
  @Input() transfer: ApiConversationTransfers;

  constructor() { }

  ngOnInit() {
  }

}
