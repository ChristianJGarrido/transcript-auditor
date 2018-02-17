import { Component, OnInit, Input, HostBinding } from '@angular/core';

@Component({
  selector: 'app-conversation-assessment-summary-stars',
  templateUrl: './conversation-assessment-summary-stars.component.html',
  styleUrls: ['./conversation-assessment-summary-stars.component.css']
})
export class ConversationAssessmentSummaryStarsComponent implements OnInit {
  @HostBinding('class') class = 'col-auto';
  @Input() rating: number;

  constructor() { }

  ngOnInit() {
  }

}
