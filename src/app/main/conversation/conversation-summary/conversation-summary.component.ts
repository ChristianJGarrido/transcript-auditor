import { Component, OnInit, OnChanges, Input, OnDestroy, HostBinding } from '@angular/core';
import {
  ApiConversationHistoryRecord,
  AfConversationForm,
  AfConversationData
} from '../../../shared/interfaces/interfaces';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AfDataService } from '../../../shared/services/af-data.service';

// 3rd party
import * as _ from 'lodash';

@Component({
  selector: 'app-conversation-summary',
  templateUrl: './conversation-summary.component.html',
  styleUrls: ['./conversation-summary.component.css']
})
export class ConversationSummaryComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col-12';
  @Input() apiConversation: ApiConversationHistoryRecord;
  @Input() afConversationsData: AfConversationData[];

  afConversationData: AfConversationData;

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
    if (this.apiConversation && this.afConversationsData) {
      // show form
      this.formReady = true;
      // get id and data
      const conversation = this.afConversationsData.find(
        afConversation => afConversation.conversationId === this.apiConversation.info.conversationId
      );
      // save data
      this.afConversationData = conversation;
      // show data
      if (conversation) {
        const data = conversation.data;
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

  ngOnInit() {
    this.getFormData();
  }

  ngOnChanges() {
    this.getFormData();
  }
}
