import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { ApiConversationHistoryRecord, AfConversations } from '../../shared/interfaces/interfaces';

// services
import { AfDataService } from '../../shared/services/af-data.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges {
  @Input() conversation: ApiConversationHistoryRecord;
  @Input() afData: AfConversations;

  formReady = false;
  note;
  select;

  constructor(private afDataService: AfDataService) { }

  /**
   * Updates the conversations note
   * @param {string} note
   */
  updateNote(note: string) {
    this.afDataService.updateConversation(this.conversation.info.conversationId, { note });
  }

  /**
   * Updates the conversations select
   * @param {string} select
   */
  updateSelect(select: string) {
    this.afDataService.updateConversation(this.conversation.info.conversationId, {select });
  }

  /**
   * Update form data when inputs change
   */
  getFormData() {
    if (this.conversation && this.afData) {
      this.formReady = true;
      const id: string = this.conversation.info.conversationId;
      const data = this.afData.conversations[id];
      if (data) {
        this.note = data.note;
        this.select = data.select;
      }
    }

  }

  ngOnInit() {
    this.getFormData();
  }

  ngOnChanges() {
    this.getFormData();
  }

}
