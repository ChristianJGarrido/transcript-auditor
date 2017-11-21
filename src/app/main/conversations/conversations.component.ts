import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiConversationHistoryRecord, ApiOptions } from '../../shared/interfaces/interfaces';

// services
import { ApiDataService } from '../../shared/services/api-data.service';

// 3rd party
import { DatatableComponent } from '@swimlane/ngx-datatable';
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts
} from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-conversations',
  templateUrl: './conversations.component.html',
  styleUrls: ['./conversations.component.css']
})
export class ConversationsComponent implements OnInit, OnChanges {
  @ViewChild('table') table: DatatableComponent;
  @Input() conversations: ApiConversationHistoryRecord[] = [];
  @Output() selectConversation = new EventEmitter<ApiConversationHistoryRecord>();

  to = new Date();
  dateTo = new FormControl(new Date(this.to.setDate(this.to.getDate() - 1)));
  dateFrom = new FormControl(new Date(this.to.setDate(this.to.getDate() - 7)));

  rows: any[] = [];
  columns: any[] = [];

  searchOptions: IMultiSelectOption[] = [
    { id: 'keyword', name: 'Keyword' },
    { id: 'summary', name: 'Summary' },
    { id: 'sdeSearch', name: 'SDE Search', isLabel: true },
    { id: 'personalInfo', name: 'Personal Info' },
    { id: 'customerInfo', name: 'Customer Info' },
    { id: 'userUpdate', name: 'User Update' }
  ];
  searchSelect: any[] = [this.searchOptions[0].id];
  searchSettings: IMultiSelectSettings = {
    // showUncheckAll: true,
    // showCheckAll: true,
    // enableSearch: true,
    buttonClasses: 'btn btn-outline-secondary btn-sm',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true
  };
  searchTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'selected',
    searchPlaceholder: 'Search',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'None',
    allSelected: 'All'
  };
  searchKeyword = '';

  constructor(private apiDataService: ApiDataService) {}

  /**
   * request new data from API with optional search params
   */
  getData() {
    let options: ApiOptions;
    let sdeSearch;

    // assign searcgh params to options
    if (this.searchKeyword) {
      this.searchSelect.forEach(key => {
        switch (key) {
          case 'personalInfo':
          case 'customerInfo':
          case 'userUpdate':
            sdeSearch = {
              ...sdeSearch,
              [key]: this.searchKeyword
            };
            break;
          default:
            options = {
              ...options,
              [key]: this.searchKeyword
            };
            break;
        }
      });
    }

    // attach sdeSearch param
    if (sdeSearch) {
      options = {
        ...options,
        sdeSearch
      };
    }

    // attach time
    options = {
      ...options,
      start: {
        from: this.dateFrom.value,
        to: this.dateTo.value
      }
    };

    // get new data from API
    this.apiDataService.getData(options);
  }

  /**
   * selects an individual conversation
   * @param {any} event
   */
  clickDatatable(event: any): void {
    if (event.type === 'click') {
      const conversation = this.conversations.find(
        record => record.info.conversationId === event.row.conversationId
      );
      if (conversation) {
        this.selectConversation.emit(conversation);
      }
    }
  }

  ngOnInit() {
    this.columns = [
      { prop: 'startTime', name: 'Start', flexGrow: 1, cellClass: 'datatable-cells' },
      { prop: 'message', name: 'Message', flexGrow: 3 }
    ];
  }

  ngOnChanges() {
    if (this.conversations) {
      this.rows = this.conversations.map(conversation => {
        const message =
          conversation.messageRecords[0] &&
          conversation.messageRecords[0].messageData &&
          conversation.messageRecords[0].messageData.msg &&
          conversation.messageRecords[0].messageData.msg.text;
        return {
          ...conversation.info,
          startTime: conversation.info && conversation.info.startTime.substr(0, 10),
          message: message || ''
        };
      });
      this.table.bodyHeight = 400;
    }
  }
}
