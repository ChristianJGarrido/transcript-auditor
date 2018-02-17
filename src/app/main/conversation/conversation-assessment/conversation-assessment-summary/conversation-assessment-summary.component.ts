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
import * as AfDataActions from '../../../../shared/store/af-data/af-data.actions';
import * as AssessmentActions from '../../../../shared/store/assessment/assessment.actions';
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
export class ConversationAssessmentSummaryComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() assessments: AssessmentModel[];

  dialogRef: MatDialogRef<ConversationAssessmentSummarySliderComponent>;

  constructor(public dialog: MatDialog, private store: Store<StoreModel>) {}

  /**
   * Opens the material dialog modal
   */
  openDialog(): void {
    this.dialogRef = this.dialog.open(ConversationAssessmentSummarySliderComponent, {
      maxWidth: 400,
      position: { top: '15%', right: '15%' },
      hasBackdrop: true,
    });
  }

  ngOnInit() {
  }

  ngOnChanges() {
  }
}
