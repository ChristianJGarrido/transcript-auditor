import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationInteractions } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-message-interaction',
  templateUrl: './message-interaction.component.html',
  styleUrls: ['./message-interaction.component.css']
})
export class MessageInteractionComponent implements OnInit {
  @Input() interaction: ApiConversationInteractions;

  constructor() { }

  ngOnInit() {
  }

}
