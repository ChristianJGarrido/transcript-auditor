import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';
import { UtilityService } from '../../../../shared/services/utility.service';

@Component({
  selector: 'app-conversation-assessment-control',
  templateUrl: './conversation-assessment-control.component.html',
  styleUrls: ['./conversation-assessment-control.component.css'],
})
export class ConversationAssessmentControlComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;

  constructor(private utilityService: UtilityService) {}

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(
      this.assessmentSelect.id,
      this.assessmentState.idsByConversation
    );
  }

  // returns true if was updated
  isUpdated(): boolean {
    return (
      this.assessmentSelect.createdAt.toString() !==
      this.assessmentSelect.lastUpdateAt.toString()
    );
  }

  ngOnInit() {}
}
