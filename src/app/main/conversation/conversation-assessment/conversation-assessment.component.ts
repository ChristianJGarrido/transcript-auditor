import {
  Component,
  OnInit,
  Input,
  HostBinding,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import { AssessmentModel } from '../../../shared/store/assessment/assessment.model';
import * as AssessmentActions from '../../../shared/store/assessment/assessment.actions';

@Component({
  selector: 'app-conversation-assessment',
  templateUrl: './conversation-assessment.component.html',
  styleUrls: ['./conversation-assessment.component.css'],
})
export class ConversationAssessmentComponent implements OnInit {
  @HostBinding('class') class = 'col-12';
  @Input() assessments: AssessmentModel[];
  @Input() assessmentSelect: AssessmentModel;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit() {}
}
