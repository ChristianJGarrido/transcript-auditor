import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationMessageRecord } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-message-link',
  templateUrl: './conversation-message-link.component.html',
  styleUrls: ['./conversation-message-link.component.css']
})
export class ConversationMessageLinkComponent implements OnInit {
  @Input() message: ApiConversationMessageRecord;

  constructor() { }

  ngOnInit() {
  }

}
