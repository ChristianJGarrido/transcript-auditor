import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-conversation-stats-widget',
  templateUrl: './conversation-stats-widget.component.html',
  styleUrls: ['./conversation-stats-widget.component.css']
})
export class ConversationStatsWidgetComponent implements OnInit {
  @Input() metricName: any;
  @Input() metricValue: any;
  @HostBinding('class') class = 'col-3 pr-1 pt-1';

  constructor() { }

  ngOnInit() {
  }

}
