import { Component, OnInit, HostBinding, Input } from '@angular/core';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';

@Component({
  selector: 'app-conversation-assessment-qa',
  templateUrl: './conversation-assessment-qa.component.html',
  styleUrls: ['./conversation-assessment-qa.component.css']
})
export class ConversationAssessmentQaComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;

  constructor() { }

  ngOnInit() {
  }

}
