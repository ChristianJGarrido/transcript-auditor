import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationMessageRecord } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-message-text',
  templateUrl: './message-text.component.html',
  styleUrls: ['./message-text.component.css']
})
export class MessageTextComponent implements OnInit {
  @Input() message: ApiConversationMessageRecord;

  constructor() { }

  ngOnInit() {
  }

}
