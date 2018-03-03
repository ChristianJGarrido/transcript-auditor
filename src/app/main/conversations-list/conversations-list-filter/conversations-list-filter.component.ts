import { Component, OnInit, OnDestroy, HostBinding, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as conversationActions from '../../../shared/store/conversation/conversation.actions';
import * as fromConversation from '../../../shared/store/conversation/conversation.reducer';

import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts
} from 'angular-2-dropdown-multiselect';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import { ApiOptions, ApiSearchSdes, ApiIds } from '../../../shared/interfaces/interfaces';

@Component({
  selector: 'app-conversations-list-filter',
  templateUrl: './conversations-list-filter.component.html',
  styleUrls: ['./conversations-list-filter.component.css']
})
export class ConversationsListFilterComponent implements OnInit {
  @HostBinding('class') class = 'col';
  @Input() loading: boolean;

  to = new Date();
  dateTo = new FormControl(new Date(this.to.setDate(this.to.getDate() - 1)));
  dateFrom = new FormControl(new Date(this.to.setDate(this.to.getDate() - 7)));

  filterOptions: IMultiSelectOption[] = [
    { id: 'status', name: 'Status', isLabel: true },
    { id: 'OPEN', name: 'Open' },
    { id: 'CLOSE', name: 'Closed' },
    { id: 'source', name: 'Source', isLabel: true },
    { id: 'APP', name: 'App' },
    { id: 'WEB', name: 'Web' },
    { id: 'FACEBOOK', name: 'Facebook' },
    { id: 'AGENT', name: 'Agent' },
    { id: 'SMS', name: 'SMS' },
    { id: 'device', name: 'Device', isLabel: true },
    { id: 'DESKTOP', name: 'Desktop' },
    { id: 'TABLET', name: 'Tablet' },
    { id: 'MOBILE', name: 'Mobile' },
    { id: 'NA', name: 'NA' }
  ];
  searchOptions: IMultiSelectOption[] = [
    { id: 'keywordSearch', name: 'Keyword Search', isLabel: true },
    { id: 'keyword', name: 'Keyword' },
    { id: 'summary', name: 'Summary' },
    { id: 'sdeSearch', name: 'SDE Search', isLabel: true },
    { id: 'personalInfo', name: 'Personal Info' },
    { id: 'customerInfo', name: 'Customer Info' },
    { id: 'userUpdate', name: 'User Update' },
    { id: 'idSearch', name: 'ID Search', isLabel: true },
    { id: 'conversationId', name: 'Conversation ID' }
  ];
  searchSelect: any[] = [this.searchOptions[1].id];
  filterSelect: any[] = [];
  searchSettings: IMultiSelectSettings = {
    buttonClasses: 'btn btn-outline-secondary btn-sm',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true
  };
  filterTexts: IMultiSelectTexts = {
    checkedPlural: 'filters',
    defaultTitle: 'Filter',
    allSelected: 'All'
  };
  searchTexts: IMultiSelectTexts = {
    checkedPlural: 'selected',
    defaultTitle: 'None',
    allSelected: 'All'
  };
  searchKeyword = '';

  options: ApiOptions = null;
  sdeSearch: ApiSearchSdes;
  ids: ApiIds;

  constructor(private store: Store<StoreModel>) {}

  /**
   * request new data from API with optional search params
   */
  getData() {
    this.options = null;
    this.sdeSearch = null;
    this.ids = null;

    // assign search params to options
    if (this.searchKeyword) {
      this.searchSelect.forEach(key => {
        switch (key) {
          case 'personalInfo':
          case 'customerInfo':
          case 'userUpdate':
            this.sdeSearch = {
              ...this.sdeSearch,
              [key]: this.searchKeyword
            };
            break;
          case 'conversationId':
          case 'consumerId':
            this.ids = {
              ...this.ids,
              [key]: this.searchKeyword
            };
            break;
          default:
            this.options = {
              ...this.options,
              [key]: this.searchKeyword
            };
            break;
        }
      });
    }

    // get filter options
    this.filterSelect.forEach(key => {
      switch (key) {
        case 'OPEN':
        case 'CLOSE':
          this.options = {
            ...this.options,
            status: this.options && this.options.status ? [...this.options.status, key] : [key]
          };
          break;
        case 'APP':
        case 'WEB':
        case 'FACEBOOK':
        case 'AGENT':
        case 'SMS':
        this.options = {
            ...this.options,
            source: this.options && this.options.source ? [...this.options.source, key] : [key]
          };
          break;

        case 'DESKTOP':
        case 'TABLET':
        case 'MOBILE':
        case 'NA':
        this.options = {
            ...this.options,
            device: this.options && this.options.device ? [...this.options.device, key] : [key]
          };
          break;
        default:
          break;
      }
    });

    // attach sdeSearch param
    if (this.sdeSearch) {
      this.options = {
        ...this.options,
        sdeSearch: this.sdeSearch
      };
    }

    // attach time
    this.options = {
      ...this.options,
      start: {
        from: new Date(this.dateFrom.value).getTime(),
        to: new Date(this.dateTo.value).getTime(),
      }
    };

    this.store.dispatch(new conversationActions.Query('all', this.options));

  }

  ngOnInit() {
  }

}
