/* tslint:disable:max-line-length */
import {
  Component,
  OnInit,
  OnChanges,
  Input,
  HostBinding,
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as AssessmentActions from '../../../../shared/store/assessment/assessment.actions';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConversationAssessmentSummarySliderComponent } from './conversation-assessment-summary-slider/conversation-assessment-summary-slider.component';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../app.store';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
/* tslint:enable:max-line-length */

@Component({
  selector: 'app-conversation-assessment-summary',
  templateUrl: './conversation-assessment-summary.component.html',
  styleUrls: ['./conversation-assessment-summary.component.css'],
})
export class ConversationAssessmentSummaryComponent
  implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;

  dialogRef: MatDialogRef<ConversationAssessmentSummarySliderComponent>;

  constructor(public dialog: MatDialog, private store: Store<StoreModel>) {}

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(
      ConversationAssessmentSummarySliderComponent,
      {
        maxWidth: 400,
        position: { top: '15%', right: '15%' },
        hasBackdrop: true,
        data: {
          id: this.assessmentSelect.id,
          personality: this.assessmentSelect.personality,
        },
      }
    );
  }

  /**
   * Calculates the weighted personality score
   * @return {string}
   */
  calculatePersonality(): string {
    const descriptors = this.assessmentSelect.personality;
    const score =
      (descriptors &&
        descriptors.reduce((prev, curr) => {
          return prev + curr.score;
        }, 0)) ||
      0;
    const personality = score / (descriptors.length * 5);
    return personality > 0 ? `+${personality}` : `${personality}`;
  }

  ngOnInit() {}

  ngOnChanges() {}
}
