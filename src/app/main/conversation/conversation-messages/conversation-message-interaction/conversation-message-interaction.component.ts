import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationInteractions } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-message-interaction',
  templateUrl: './conversation-message-interaction.component.html',
  styleUrls: ['./conversation-message-interaction.component.css']
})
export class ConversationMessageInteractionComponent implements OnInit {
  @Input() interaction: ApiConversationInteractions;

  constructor() { }

  ngOnInit() {
  }

}
