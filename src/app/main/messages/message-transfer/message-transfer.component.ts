import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationTransfers } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-message-transfer',
  templateUrl: './message-transfer.component.html',
  styleUrls: ['./message-transfer.component.css']
})
export class MessageTransferComponent implements OnInit {
  @Input() transfer: ApiConversationTransfers;

  constructor() { }

  ngOnInit() {
  }

}
