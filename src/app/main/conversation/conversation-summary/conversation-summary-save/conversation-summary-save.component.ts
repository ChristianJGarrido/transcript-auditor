import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AfConversationData } from '../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-summary-save',
  templateUrl: './conversation-summary-save.component.html',
  styleUrls: ['./conversation-summary-save.component.css']
})
export class ConversationSummarySaveComponent implements OnInit {
  @Input() afConversationData: AfConversationData;

  constructor() { }

  ngOnInit() {
    // this.afSave$ = this.afDataService.afSave$;
  }

}
