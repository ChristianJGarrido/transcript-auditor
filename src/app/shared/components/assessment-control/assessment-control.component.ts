import { Component, OnInit, Input, HostBinding } from '@angular/core';
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
  @HostBinding('class') class = 'col-auto';
  @Input() assessment: AssessmentModel;

  constructor(private store: Store<StoreModel>) { }

  createAssessment(): void {
    this.store.dispatch(new AssessmentActions.Create());
  }

  deleteAssessment(id: string): void {
    this.store.dispatch(new AssessmentActions.Delete(id));
  }

  ngOnInit() {
  }

}
