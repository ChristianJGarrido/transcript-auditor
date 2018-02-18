import { Component, OnInit, Input, OnChanges } from '@angular/core';
import * as AssessmentActions from '../../../../../shared/store/assessment/assessment.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../../app.store';

@Component({
  selector: 'app-conversation-assessment-summary-notes',
  templateUrl: './conversation-assessment-summary-notes.component.html',
  styleUrls: ['./conversation-assessment-summary-notes.component.css']
})
export class ConversationAssessmentSummaryNotesComponent implements OnInit {
  @Input() id: string;
  @Input() note: string;

  constructor(private store: Store<StoreModel>) {}

  /**
   * Updates the assessment note
   * @param {string} note
   */
  updateNote(note: string): void {
    this.store.dispatch(new AssessmentActions.Update(this.id, { note }));
  }

  ngOnInit() {}
}
