import { Component, OnInit, Input } from '@angular/core';
import { AfConversationForm } from '../../../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversation-assessment-summary-select',
  templateUrl: './conversation-assessment-summary-select.component.html',
  styleUrls: ['./conversation-assessment-summary-select.component.css']
})
export class ConversationAssessmentSummarySelectComponent implements OnInit {
  @Input() formData: AfConversationForm;
  @Input() id: string;

  constructor() {}

  /**
   * Updates the conversations select
   * @param {string} select
   */
  changeSelect(select: string) {
    // this.afDataService.toggleSave('saving');
    // this.afDataService.updateConversation(this.id, {
    //   select: this.formData.select
    // });
  }

  /**
   * Updates the conversations checkboxes
   * @param {any[]} select
   */
  changeCheck(check: any[]) {
    // this.afDataService.toggleSave('saving');
    // this.afDataService.updateConversation(this.id, {
    //   check: this.formData.check
    // });
  }

  ngOnInit() {}
}
