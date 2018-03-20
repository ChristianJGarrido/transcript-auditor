import { Component, OnInit, HostBinding, Input } from '@angular/core';
import {
  AssessmentModel,
  AssessmentQaModel,
  AssessmentQaGroupModel,
} from '../../../../shared/store/assessment/assessment.model';
import * as assessmentActions from '../../../../shared/store/assessment/assessment.actions';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../app.store';
import { UtilityService } from '../../../../shared/services/utility.service';

@Component({
  selector: 'app-conversation-assessment-qa',
  templateUrl: './conversation-assessment-qa.component.html',
  styleUrls: ['./conversation-assessment-qa.component.css']
})
export class ConversationAssessmentQaComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;

  constructor(private store: Store<StoreModel>, private utilityService: UtilityService) {}

  /**
   * calculates the percent score for each qa section
   * @param {AssessmentQaModel} group
   * @return {number}
   */
  calculateGroupScore(group: AssessmentQaModel): number {
    const { score } = this.utilityService.calculateQaGroupScore(group);
    return score;
  }

  /**
   * calculates the total qa score
   * @param {AssessmentQaModel[]} qa
   * @return {number}
   */
  calculateTotalScore(qa: AssessmentQaModel[]): number {
    const { score } = this.utilityService.calculateQaTotalScore(qa);
    return score;
  }

  /**
   * sends review to store
   */
  saveReview(): void {
    const id = this.assessmentSelect.id;
    this.store.dispatch(
      new assessmentActions.Update(id, { qa: this.assessmentSelect.qa })
    );
  }

  trackByFn(index, item) {
    return index;
  }

  ngOnInit() {}
}
