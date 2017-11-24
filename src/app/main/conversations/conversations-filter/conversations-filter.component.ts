import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiDataService } from '../../../shared/services/api-data.service';
import { ApiOptions, ApiIds, ApiSearchSdes } from '../../../shared/interfaces/interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// 3rd party
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts
} from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-conversations-filter',
  templateUrl: './conversations-filter.component.html',
  styleUrls: ['./conversations-filter.component.css']
})
export class ConversationsFilterComponent implements OnInit {
  apiLoading$: BehaviorSubject<boolean>;

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

  constructor(private apiDataService: ApiDataService) {}

  /**
   * request new data from API with optional search params
   */
  getData() {
    let options: ApiOptions = null;
    let sdeSearch: ApiSearchSdes;
    let ids: ApiIds = null;

    // assign search params to options
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
          case 'conversationId':
          case 'consumerId':
            ids = {
              ...ids,
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

    // get filter options
    this.filterSelect.forEach(key => {
      switch (key) {
        case 'OPEN':
        case 'CLOSE':
          options = {
            ...options,
            status: options && options.status ? [...options.status, key] : [key]
          };
          break;
        case 'APP':
        case 'WEB':
        case 'FACEBOOK':
        case 'AGENT':
        case 'SMS':
          options = {
            ...options,
            source: options && options.source ? [...options.source, key] : [key]
          };
          break;

        case 'DESKTOP':
        case 'TABLET':
        case 'MOBILE':
        case 'NA':
          options = {
            ...options,
            device: options && options.device ? [...options.device, key] : [key]
          };
          break;
        default:
          break;
      }
    });

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
    this.apiDataService.getData(options, ids);
  }

  ngOnInit() {
    this.apiLoading$ = this.apiDataService.apiLoading$;
  }
}
