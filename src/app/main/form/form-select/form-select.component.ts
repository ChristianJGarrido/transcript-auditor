import { Component, OnInit, Input } from '@angular/core';
import { AfDataService } from '../../../shared/services/af-data.service';

@Component({
  selector: 'app-form-select',
  templateUrl: './form-select.component.html',
  styleUrls: ['./form-select.component.css']
})
export class FormSelectComponent implements OnInit {
  @Input() select: string;
  @Input() id: string;

  constructor(private afDataService: AfDataService) {}

  /**
   * Updates the conversations select
   * @param {string} select
   */
  changeSelect(select: string) {
    this.afDataService.toggleSave('saving');
    this.afDataService.updateConversation(this.id, {
      select
    });
  }

  ngOnInit() {}
}
