import { Component, OnInit, Input, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AssessmentPersonalityModel } from '../../../../../shared/store/assessment/assessment.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../../app.store';
import * as AssessmentActions from '../../../../../shared/store/assessment/assessment.actions';
import { Subscription } from 'rxjs';
import { UtilityService } from '../../../../../shared/services/utility.service';
import { QaService } from '../../../../../shared/services/qa.service';

@Component({
  selector: 'app-conversation-assessment-summary-slider',
  templateUrl: './conversation-assessment-summary-slider.component.html',
  styleUrls: ['./conversation-assessment-summary-slider.component.css'],
})
export class ConversationAssessmentSummarySliderComponent
  implements OnInit, OnDestroy {
  afterCloseSub: Subscription;
  constructor(
    private utilityService: UtilityService,
    private qaService: QaService,
    private store: Store<StoreModel>,
    public dialogRef: MatDialogRef<
      ConversationAssessmentSummarySliderComponent
    >,
    @Inject(MAT_DIALOG_DATA)
    public data: { id: string; personality: AssessmentPersonalityModel[] }
  ) {}

  /**
   * Updates the assessment rating
   */
  updatePersonality(): void {
    const personality = this.data.personality;
    this.store.dispatch(
      new AssessmentActions.Update(this.data.id, { personality })
    );
  }

  /**
   * Calculates the weighted personality score
   * @return {string}
   */
  calculatePersonality(): string {
    return this.qaService.calculatePersonality(
      this.data.personality
    );
  }

  ngOnInit() {
    this.afterCloseSub = this.dialogRef
      .beforeClose()
      .subscribe(() => this.updatePersonality());
  }

  ngOnDestroy() {
    this.afterCloseSub.unsubscribe();
  }
}
