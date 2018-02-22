import { Component, OnInit, Input, HostBinding } from '@angular/core';
import * as AssessmentActions from '../../../../../shared/store/assessment/assessment.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../../app.store';

@Component({
  selector: 'app-conversation-assessment-summary-stars',
  templateUrl: './conversation-assessment-summary-stars.component.html',
  styleUrls: ['./conversation-assessment-summary-stars.component.css']
})
export class ConversationAssessmentSummaryStarsComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() id: string;
  @Input() rating: number;

  constructor(private store: Store<StoreModel>) {}

  /**
   * Updates the assessment rating (only if changed)
   * @param {number} rating
   */
  updateRating({ rating }): void {
    if (this.rating !== rating) {
      this.store.dispatch(new AssessmentActions.Update(this.id, { rating }));
    }
  }

  ngOnInit() {}
}
