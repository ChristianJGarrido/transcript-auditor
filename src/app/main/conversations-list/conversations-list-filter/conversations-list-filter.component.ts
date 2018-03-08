import {
  Component,
  OnInit,
  OnDestroy,
  HostBinding,
  Input,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import * as conversationActions from '../../../shared/store/conversation/conversation.actions';
import * as filterActions from '../../../shared/store/filter/filter.actions';
import * as fromConversation from '../../../shared/store/conversation/conversation.reducer';

import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts,
} from 'angular-2-dropdown-multiselect';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import {
  ApiOptions,
  ApiSearchSdes,
  ApiIds,
} from '../../../shared/interfaces/interfaces';
import { ListModel } from '../../../shared/store/list/list.model';
import { FilterModel } from '../../../shared/store/filter/filter.model';

@Component({
  selector: 'app-conversations-list-filter',
  templateUrl: './conversations-list-filter.component.html',
  styleUrls: ['./conversations-list-filter.component.css'],
})
export class ConversationsListFilterComponent implements OnInit {
  @HostBinding('class') class = 'col';
  @Input() loading: boolean;
  @Input() list: ListModel;
  @Input() filter: FilterModel;

  to = new Date();
  dateTo = new FormControl(new Date(this.to.setDate(this.to.getDate() - 1)));
  dateFrom = new FormControl(new Date(this.to.setDate(this.to.getDate() - 7)));

  agentsList: any[] = [];
  skillsList: any[] = [];
  groupsList: any[] = [];

  agentsSelect: any[] = [];
  skillsSelect: any[] = [];
  groupsSelect: any[] = [];

  typeOptions: IMultiSelectOption[] = [
    { id: 'conversations', name: 'Conversations' },
    { id: 'chats', name: 'Chats' },
  ];

  filterOptions: IMultiSelectOption[] = [
    { id: 'filterLabel', name: 'MESSAGING ONLY', isLabel: true },
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
    { id: 'NA', name: 'NA' },
  ];
  searchOptions: IMultiSelectOption[] = [
    { id: 'keywordSearch', name: 'Keyword Search', isLabel: true },
    { id: 'keyword', name: 'Keyword' },
    { id: 'summary', name: 'Summary' },
    { id: 'surveyAnswer', name: 'Survey Answer (Chat)' },
    { id: 'surveyQuestion', name: 'Survey Question (Chat)' },
    { id: 'idSearch', name: 'ID Search', isLabel: true },
    { id: 'conversationId', name: 'Conversation/Engagement ID' },
    { id: 'sdeSearch', name: 'SDE Search', isLabel: true },
    { id: 'personalInfo', name: 'Personal Info' },
    { id: 'customerInfo', name: 'Customer Info' },
    { id: 'userUpdate', name: 'User Update (Msg)' },
    { id: 'ea.purchase', name: 'Purchase (Chat)' },
    { id: 'ea.viewedProduct', name: 'Viewed Product (Chat)' },
    { id: 'ea.lead', name: 'Lead (Chat)' },
    { id: 'ea.cartStatus', name: 'Cart Status (Chat)' },
    { id: 'ea.serviceActivity', name: 'Service Activity (Chat)' },
    { id: 'ea.visitorError', name: 'Visitor Error (Chat)' },
    { id: 'ea.marketingCampaignInfo', name: 'Marketing Info (Chat)' },
  ];

  searchSchema = {
    'ea.marketingCampaignInfo': 'sdeChat',
    'ea.visitorError': 'sdeChat',
    'ea.serviceActivity': 'sdeChat',
    'ea.cartStatus': 'sdeChat',
    'ea.lead': 'sdeChat',
    'ea.viewedProduct': 'sdeChat',
    'ea.purchase': 'sdeChat',
    userUpdate: 'sdeMsg',
    customerInfo: 'sdeAll',
    personalInfo: 'sdeAll',
    surveyAnswer: 'sdeChat',
    surveyQuestion: 'sdeChat',
    summary: 'bodyMsg',
    keyword: 'bodyKeyword',
    conversationId: 'bodyId',
    engagementId: 'bodyId',
  };

  searchSelect: any[] = [this.searchOptions[1].id];
  filterSelect: any[] = [];
  typeSelect: any[] = [];

  searchSettings: IMultiSelectSettings = {
    buttonClasses: 'btn btn-outline-secondary btn-sm',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
  };
  typeSettings: IMultiSelectSettings = {
    ...this.searchSettings,
  };
  filterTexts: IMultiSelectTexts = {
    checkedPlural: 'filters',
    defaultTitle: 'Filter',
    allSelected: 'All',
  };
  searchTexts: IMultiSelectTexts = {
    checkedPlural: 'selected',
    defaultTitle: 'None',
    allSelected: 'All',
  };
  searchKeyword = '';

  listSettings: IMultiSelectSettings = {
    ...this.searchSettings,
    showUncheckAll: true,
    enableSearch: true,
  };

  typeTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Types',
    allSelected: 'All Types',
  };

  listAgentsTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Agents',
    uncheckAll: 'Reset',
  };
  listSkillsTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Skills',
    uncheckAll: 'Reset',
  };
  listGroupsTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Agent Groups',
    uncheckAll: 'Reset',
  };

  optionsChat: any = null;
  optionsMsg: any = null;
  sdesChat: any = [];
  sdesMsg: any = null;

  constructor(private store: Store<StoreModel>) {}

  /**
   * select only chat or conversation types
   */
  updateTypes(): void {
     this.store.dispatch(new filterActions.ToggleTypes(this.typeSelect));
  }

  /**
   * request new data from API with optional search params
   */
  getData(): void {
    this.optionsMsg = null;
    this.optionsChat = null;
    this.sdesMsg = null;
    this.sdesChat = [];

    // assign search params to options
    if (this.searchKeyword) {
      this.searchSelect.forEach(key => {
        switch (this.searchSchema[key]) {
          case 'sdeChat':
            this.sdesChat = [...this.sdesChat, key];
            break;
          case 'sdeAll':
            this.sdesChat = [...this.sdesChat, `ea.${key}`];
            this.sdesMsg = {
              ...this.sdesMsg,
              [key]: this.searchKeyword,
            };
            break;
          case 'bodyMsg':
            this.optionsMsg = {
              ...this.optionsMsg,
              [key]: this.searchKeyword,
            };
            break;
          case 'bodyChat':
            this.optionsChat = {
              ...this.optionsChat,
              [key]: this.searchKeyword,
            };
            break;
          case 'sdeMsg':
            this.sdesMsg = {
              ...this.sdesMsg,
              [key]: this.searchKeyword,
            };
            break;
          case 'bodyId':
            {
              this.optionsChat = {
                ...this.optionsChat,
                engagementId: this.searchKeyword,
              };
              this.optionsMsg = {
                ...this.optionsMsg,
                conversationId: this.searchKeyword,
              };
            }
            break;
          case 'bodyKeyword':
            this.optionsChat = {
              ...this.optionsChat,
              [key]: this.searchKeyword,
            };
            this.optionsMsg = {
              ...this.optionsMsg,
              [key]: this.searchKeyword,
            };
            this.sdesChat = [...this.sdesChat, 'chatLine'];
            break;
        }
      });
    }

    // get filter options
    this.filterSelect.forEach(key => {
      switch (key) {
        case 'OPEN':
        case 'CLOSE':
          this.optionsMsg = {
            ...this.optionsMsg,
            status:
              this.optionsMsg && this.optionsMsg.status
                ? [...this.optionsMsg.status, key]
                : [key],
          };
          break;
        case 'APP':
        case 'WEB':
        case 'FACEBOOK':
        case 'AGENT':
        case 'SMS':
          this.optionsMsg = {
            ...this.optionsMsg,
            source:
              this.optionsMsg && this.optionsMsg.source
                ? [...this.optionsMsg.source, key]
                : [key],
          };
          break;

        case 'DESKTOP':
        case 'TABLET':
        case 'MOBILE':
        case 'NA':
          this.optionsMsg = {
            ...this.optionsMsg,
            device:
              this.optionsMsg && this.optionsMsg.device
                ? [...this.optionsMsg.device, key]
                : [key],
          };
          break;
        default:
          break;
      }
    });

    // attach sdeSearch param
    if (this.sdesMsg) {
      this.optionsMsg = {
        ...this.optionsMsg,
        sdeSearch: this.sdesMsg,
      };
    }
    if (this.sdesChat.length) {
      this.optionsChat = {
        ...this.optionsChat,
        keyword_search_area: {
          types: this.sdesChat,
        },
      };
    }

    // attach time
    const start = {
      from: new Date(this.dateFrom.value).getTime(),
      to: new Date(this.dateTo.value).getTime(),
    };
    this.optionsMsg = {
      ...this.optionsMsg,
      start,
    };
    this.optionsChat = {
      ...this.optionsChat,
      start,
    };

    this.store.dispatch(
      new conversationActions.Query('all', {
        msg: this.optionsMsg,
        chat: this.optionsChat,
      })
    );
  }

  ngOnInit() {
    this.typeSelect = this.filter.types;
  }
}
