import { Component, OnInit, HostBinding, Input } from '@angular/core';
import {
  AssessmentModel,
  AssessmentQaModel,
} from '../../../../shared/store/assessment/assessment.model';
import * as assessmentActions from '../../../../shared/store/assessment/assessment.actions';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../app.store';

@Component({
  selector: 'app-conversation-assessment-qa',
  templateUrl: './conversation-assessment-qa.component.html',
  styleUrls: ['./conversation-assessment-qa.component.css']
})
export class ConversationAssessmentQaComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;

  constructor(private store: Store<StoreModel>) {}

  /**
   * calculates the percent score for each qa section
   * @param {any[]} section
   * @return {number}
   */
  calculateGroupScore(section: any[]): number {
    const { score, count } = section.reduce(
      (prev, curr) => {
        return {
          score: prev.score + curr.score,
          count: prev.count + (curr.score > 0 ? 1 : 0),
        };
      },
      {
        score: 0,
        count: 0,
      }
    );
    return score / (count * 5);
  }

  /**
   * calculates the total qa score
   * @param {AssessmentQaModel[]} qa
   * @return {number}
   */
  calculateTotalScore(qa: AssessmentQaModel[]): number {
    const { score, count } = qa.reduce(
      (prev, curr) => {
        const result = this.calculateGroupScore(curr.section) || 0;
        return {
          score: prev.score + result,
          count: prev.count + (result > 0 ? 1 : 0),
        };
      },
      { score: 0, count: 0 }
    );
    return score / count;
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
