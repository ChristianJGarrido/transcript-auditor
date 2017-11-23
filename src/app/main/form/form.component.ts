import { Component, OnInit, OnChanges, Input, OnDestroy } from '@angular/core';
import { ApiConversationHistoryRecord, AfUser } from '../../shared/interfaces/interfaces';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

// services
import { AfDataService } from '../../shared/services/af-data.service';

// material
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges {
  @Input() conversation: ApiConversationHistoryRecord;
  @Input() afData: AfUser;
  @Input() sidenav: MatDrawer;

  formReady = false;
  note = '';
  select = '';

  constructor(private afDataService: AfDataService) {}

  /**
   * Update form data when inputs change
   */
  getFormData() {
    if (this.conversation) {
      // show form
      this.formReady = true;
      // get id and data
      const id: string = this.conversation.info.conversationId;
      const data = this.afData && this.afData.conversations && this.afData.conversations[id];
      // show data
      if (data) {
        this.note = data.note;
        this.select = data.select;
      } else {
        this.note = '';
        this.select = '';
      }
    }
  }

  openSidenav() {
    this.sidenav.open();
  }

  ngOnInit() {
    this.getFormData();
  }

  ngOnChanges() {
    this.getFormData();
  }
}
