import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationMessageRecord } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-message-text',
  templateUrl: './conversation-message-text.component.html',
  styleUrls: ['./conversation-message-text.component.css']
})
export class ConversationMessageTextComponent implements OnInit {
  @Input() message: ApiConversationMessageRecord;

  constructor() { }

  ngOnInit() {
  }

}
