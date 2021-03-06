/* tslint:disable:max-line-length */
import {
  Component,
  OnInit,
  Input,
  HostBinding,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import * as AssessmentActions from '../../../../shared/store/assessment/assessment.actions';
import * as fromAssessment from '../../../../shared/store/assessment/assessment.reducer';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConversationAssessmentSummarySliderComponent } from './conversation-assessment-summary-slider/conversation-assessment-summary-slider.component';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../../app.store';
import { AssessmentModel } from '../../../../shared/store/assessment/assessment.model';
import { UtilityService } from '../../../../shared/services/utility.service';
import { QaService } from '../../../../shared/services/qa.service';
/* tslint:enable:max-line-length */

@Component({
  selector: 'app-conversation-assessment-summary',
  templateUrl: './conversation-assessment-summary.component.html',
  styleUrls: ['./conversation-assessment-summary.component.css'],
})
export class ConversationAssessmentSummaryComponent
  implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessmentState: fromAssessment.State;
  @Input() assessmentSelect: AssessmentModel;

  dialogRef: MatDialogRef<ConversationAssessmentSummarySliderComponent>;

  constructor(
    public dialog: MatDialog,
    private store: Store<StoreModel>,
    private utilityService: UtilityService,
    private qaService: QaService
  ) {}

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
    return this.qaService.calculatePersonality(
      this.assessmentSelect.personality
    );
  }

  ngOnInit() {}

}
