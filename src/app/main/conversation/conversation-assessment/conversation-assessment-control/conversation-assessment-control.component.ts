import { Component, OnInit, Input, HostBinding, ViewChild } from '@angular/core';
import { AssessmentControlComponent } from '../../../../shared/components/assessment-control/assessment-control.component';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';

@Component({
  selector: 'app-conversation-assessment-control',
  templateUrl: './conversation-assessment-control.component.html',
  styleUrls: ['./conversation-assessment-control.component.css']
})
export class ConversationAssessmentControlComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @ViewChild(AssessmentControlComponent)
    child: AssessmentControlComponent;
  @Input() assessmentState: fromAssessment.State;
  @Input() assessments: AssessmentModel[];
  @Input() assessmentSelect: AssessmentModel;

  constructor() { }

  // calls child method to create new assessment
  createAssessment(): void {
    this.child.createAssessment();
  }

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
