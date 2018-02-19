import { Component, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AfConversationData } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-assessment-save',
  templateUrl: './assessment-save.component.html',
  styleUrls: ['./assessment-save.component.css']
})
export class AssessmentSaveComponent implements OnChanges {
  @Input() updating: boolean = null;

  constructor() { }

  ngOnChanges() {
    setTimeout(() => this.updating = !this.updating ? null : this.updating, 1000);
  }

}
