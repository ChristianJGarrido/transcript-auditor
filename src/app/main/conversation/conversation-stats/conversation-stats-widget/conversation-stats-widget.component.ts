import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-conversation-stats-widget',
  templateUrl: './conversation-stats-widget.component.html',
  styleUrls: ['./conversation-stats-widget.component.css']
})
export class ConversationStatsWidgetComponent implements OnInit {
  @Input() name: any;
  @Input() value: any;
  @Input() format: string;

  constructor() { }

  ngOnInit() {
  }

}
