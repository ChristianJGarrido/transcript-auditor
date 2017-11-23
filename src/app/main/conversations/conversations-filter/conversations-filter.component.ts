import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ApiDataService } from '../../../shared/services/api-data.service';
import { ApiOptions } from '../../../shared/interfaces/interfaces';

// 3rd party
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts
} from 'angular-2-dropdown-multiselect';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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

  constructor(private apiDataService: ApiDataService) { }


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

  ngOnInit() {
    this.apiLoading$ = this.apiDataService.apiLoading$;
  }

}
