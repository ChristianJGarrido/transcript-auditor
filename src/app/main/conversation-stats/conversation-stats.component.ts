import { Component, OnInit, Input } from '@angular/core';
import { ApiConversationHistoryRecord } from '../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-stats',
  templateUrl: './conversation-stats.component.html',
  styleUrls: ['./conversation-stats.component.css']
})
export class ConversationStatsComponent implements OnInit {
  @Input() conversation: ApiConversationHistoryRecord;

  constructor() { }

  ngOnInit() {
  }

}
