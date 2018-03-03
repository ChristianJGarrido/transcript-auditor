import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationAgentParticipants } from '../../../../shared/interfaces/conversation';

@Component({
  selector: 'app-conversation-message-participant',
  templateUrl: './conversation-message-participant.component.html',
  styleUrls: ['./conversation-message-participant.component.css']
})
export class ConversationMessageParticipantComponent implements OnInit {
  @Input() participant: ApiConversationAgentParticipants;

  constructor() { }

  ngOnInit() {
  }

}
