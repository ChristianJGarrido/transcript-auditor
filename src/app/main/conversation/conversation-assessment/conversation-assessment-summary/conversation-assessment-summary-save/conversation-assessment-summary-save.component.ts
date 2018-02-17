import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AfConversationData } from '../../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-assessment-summary-save',
  templateUrl: './conversation-assessment-summary-save.component.html',
  styleUrls: ['./conversation-assessment-summary-save.component.css']
})
export class ConversationAssessmentSummarySaveComponent implements OnInit {
  @Input() afConversationData: AfConversationData;

  constructor() { }

  ngOnInit() {
    // this.afSave$ = this.afDataService.afSave$;
  }

}
