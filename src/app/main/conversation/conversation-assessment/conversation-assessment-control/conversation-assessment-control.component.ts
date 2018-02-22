import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';

@Component({
  selector: 'app-conversation-assessment-control',
  templateUrl: './conversation-assessment-control.component.html',
  styleUrls: ['./conversation-assessment-control.component.css']
})
export class ConversationAssessmentControlComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessments: AssessmentModel[];
  @Input() assessmentSelect: AssessmentModel;

  constructor() { }

  // returns index of the selected assessment
  findIndex(): number {
    const index = this.assessments.findIndex(
      assessment => assessment.id === this.assessmentSelect.id
    );
    return index ? index : 0;
  }

  ngOnInit() {
  }

}
