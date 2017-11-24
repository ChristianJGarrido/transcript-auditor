import { Component, OnInit, OnChanges, Input, OnDestroy, HostBinding } from '@angular/core';
import {
  ApiConversationHistoryRecord,
  AfUser,
  AfConversationForm
} from '../../shared/interfaces/interfaces';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AfDataService } from '../../shared/services/af-data.service';
import { MatDrawer } from '@angular/material/sidenav';

// 3rd party
import * as _ from 'lodash';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() conversation: ApiConversationHistoryRecord;
  @Input() afData: AfUser;
  @Input() sidenav: MatDrawer;

  // form properties
  formReady = false;
  formDefault: AfConversationForm = {
    note: '',
    select: '',
    check: [
      { key: 'one', value: false },
      { key: 'two', value: false },
      { key: 'three', value: false }
    ]
  };
  formData: AfConversationForm = _.cloneDeep(this.formDefault);

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
      const data =
        this.afData &&
        this.afData.conversations &&
        this.afData.conversations[id] &&
        this.afData.conversations[id].data;
      // show data
      if (data) {
        this.formData.note = data.note ? data.note : '';
        this.formData.select = data.select ? data.select : '';
        this.formData.check = data.check
          ? data.check.map(item => item)
          : this.formData.check.map(item => item);
      } else {
        this.formData = _.cloneDeep(this.formDefault);
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
