import { Component, OnInit, Input } from '@angular/core';
import { AssessmentSummaryPersonalityModel } from '../../../../../shared/store/assessment/assessment.model';

@Component({
  selector: 'app-conversation-assessment-summary-slider',
  templateUrl: './conversation-assessment-summary-slider.component.html',
  styleUrls: ['./conversation-assessment-summary-slider.component.css']
})
export class ConversationAssessmentSummarySliderComponent implements OnInit {
  @Input() personality: AssessmentSummaryPersonalityModel[];

  constructor() { }

  ngOnInit() {
  }

}
