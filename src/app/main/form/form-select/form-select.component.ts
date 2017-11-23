import { Component, OnInit, Input } from '@angular/core';
import { AfDataService } from '../../../shared/services/af-data.service';
import { AfConversationForm } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.css']
})
export class FormSelectComponent implements OnInit {
  @Input() formData: AfConversationForm;
  @Input() id: string;

  constructor(private afDataService: AfDataService) {}

  /**
   * Updates the conversations select
   * @param {string} select
   */
  changeSelect(select: string) {
    this.afDataService.toggleSave('saving');
    this.afDataService.updateConversation(this.id, {
      select: this.formData.select
    });
  }

  /**
   * Updates the conversations checkboxes
   * @param {any[]} select
   */
  changeCheck(check: any[]) {
    this.afDataService.toggleSave('saving');
    this.afDataService.updateConversation(this.id, {
      check: this.formData.check
    });
  }

  ngOnInit() {}
}
