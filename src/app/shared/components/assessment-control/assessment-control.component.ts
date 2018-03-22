import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import * as AssessmentActions from '../../store/assessment/assessment.actions';
import { AssessmentModel } from '../../store/assessment/assessment.model';

@Component({
  selector: 'app-assessment-control',
  templateUrl: './assessment-control.component.html',
  styleUrls: ['./assessment-control.component.css']
})
export class AssessmentControlComponent implements OnInit {
  @Input() assessmentSelect: AssessmentModel;

  confirm = false;

  constructor(private store: Store<StoreModel>) { }

  // creates a new assessment
  createAssessment(): void {
    this.store.dispatch(new AssessmentActions.Create());
  }

  // deletes the current assessment
  deleteAssessment(): void {
    const id = this.assessmentSelect && this.assessmentSelect.id;
    if (id) {
      this.store.dispatch(new AssessmentActions.Delete(id));
    }
    this.confirm = false;
  }

  ngOnInit() {
  }

}
