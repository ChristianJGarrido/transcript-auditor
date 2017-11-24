import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationMessageRecord } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-message-link',
  templateUrl: './message-link.component.html',
  styleUrls: ['./message-link.component.css']
})
export class MessageLinkComponent implements OnInit {
  @Input() message: ApiConversationMessageRecord;

  constructor() { }

  ngOnInit() {
  }

}
