import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';
import { UtilityService } from '../../../../shared/services/utility.service';

@Component({
  selector: 'app-conversation-assessment-control',
  templateUrl: './conversation-assessment-control.component.html',
  styleUrls: ['./conversation-assessment-control.component.css']
})
export class ConversationAssessmentControlComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;
  @Input() assessmentConversationIds: string[]|number[];

  constructor(private utilityService: UtilityService) { }

  // get conversation index
  findIndex(): number {
    return this.utilityService.findIndex(this.assessmentSelect.id, this.assessmentConversationIds);
  }

  ngOnInit() {
  }

}
