import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationAgentParticipants } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-message-participant',
  templateUrl: './message-participant.component.html',
  styleUrls: ['./message-participant.component.css']
})
export class MessageParticipantComponent implements OnInit {
  @Input() participant: ApiConversationAgentParticipants;

  constructor() { }

  ngOnInit() {
  }

}
