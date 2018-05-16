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
import { ListModel, ListAgent } from '../../../shared/store/list/list.model';
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

  listGroups: any[] = [];
  listSkills: any[] = [];
  listAgents: any[] = [];

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
    { id: 'Apple Business Chat', name: 'Apple Business Chat' },
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
  idOptions: IMultiSelectOption[] = [
    { id: 'conversation', name: 'Conversation ID' },
    { id: 'consumer', name: 'Consumer ID' },
  ];

  searchById = false;

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
  };
  // conversationId: 'bodyId',
  // consumer: 'bodyConId',

  // select arrays
  searchSelect: any[] = [this.searchOptions[1].id];
  filterSelect: any[] = [];
  typeSelect: any[] = [];
  idSelect: any[] = [this.idOptions[0].id];
  agentsSelect: any[] = [];
  skillsSelect: any[] = [];
  groupsSelect: any[] = [];

  // filter settings
  searchSettings: IMultiSelectSettings = {
    buttonClasses: 'btn btn-outline-secondary btn-sm',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
  };
  typeSettings: IMultiSelectSettings = {
    ...this.searchSettings,
  };
  idSettings: IMultiSelectSettings = {
    ...this.searchSettings,
    selectionLimit: 1,
    autoUnselect: true,
  };
  listSettings: IMultiSelectSettings = {
    ...this.searchSettings,
    showUncheckAll: true,
    enableSearch: true,
  };
  listSettingsAgent: IMultiSelectSettings = {
    ...this.listSettings,
    isLazyLoad: true,
  };

  // filter texts
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
  typeTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Types',
    allSelected: 'Conversations and Chats',
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

  searchKeyword = '';
  optionsChat: any = null;
  optionsMsg: any = null;
  sdesChat: any = [];
  sdesMsg: any = null;

  constructor(private store: Store<StoreModel>) {}

  /**
   * select only chat or conversation types
   */
  updateTypes(): void {
    this.store.dispatch(
      new filterActions.ToggleConversationTypes(this.typeSelect)
    );
  }

  /**
   * select id type to search for
   */
  updateIds(): void {
    this.store.dispatch(new filterActions.ToggleIdType(this.idSelect));
  }

  /**
   * select id type to search for
   */
  updateSearchById(): void {
    this.store.dispatch(new filterActions.ToggleSearchById(this.searchById));
  }

  /**
   * adds name prop to agent list
   * @param agents
   */
  updateListAgents(agents: ListAgent[]): ListAgent[] {
    return agents.map(agent => ({ ...agent, name: agent.fullName }));
  }

  /**
   * Lazy loading agent list
   * @param filter
   */
  loadListAgents(filter?: string): void {
    const filtered = filter
      ? this.list.agents.collection.filter(agent => agent.fullName.includes(filter))
      : this.list.agents.collection;
    if (filtered.length > 50) {
      const newList = this.updateListAgents(filtered.slice(0, 50));
      this.listAgents = [
        { name: 'Too many results... showing 50', isLabel: true },
        ...newList,
      ];
    } else {
      this.listAgents = this.updateListAgents(filtered);
    }
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
        case 'Apple Business Chat':
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
    const from = new Date(this.dateFrom.value);
    from.setHours(0, 0, 0, 0);
    const to = new Date(this.dateTo.value);
    to.setHours(23, 59, 59, 999);
    const start = {
      from: from.getTime(),
      to: to.getTime(),
    };
    this.optionsMsg = {
      ...this.optionsMsg,
      start,
    };
    this.optionsChat = {
      ...this.optionsChat,
      start,
    };

    // attach skills, agents, groups
    if (this.skillsSelect.length) {
      this.optionsChat = {
        ...this.optionsChat,
        skillIds: this.skillsSelect,
      };
      this.optionsMsg = {
        ...this.optionsMsg,
        skillIds: this.skillsSelect,
      };
    }
    if (this.groupsSelect.length) {
      this.optionsChat = {
        ...this.optionsChat,
        agentGroupIds: this.groupsSelect,
      };
      this.optionsMsg = {
        ...this.optionsMsg,
        agentGroupIds: this.groupsSelect,
      };
    }
    if (this.agentsSelect.length) {
      this.optionsChat = {
        ...this.optionsChat,
        agentIds: this.agentsSelect,
      };
      this.optionsMsg = {
        ...this.optionsMsg,
        agentIds: this.agentsSelect,
      };
    }

    // attach ids
    if (this.searchById) {
      const [idType] = this.idSelect;
      const chatIdKey = idType === 'conversation' ? 'engagementId' : 'visitor';
      const convIdKey =
        idType === 'conversation' ? 'conversationId' : 'consumer';
      this.optionsChat = {
        ...this.optionsChat,
        [chatIdKey]: this.searchKeyword,
      };
      this.optionsMsg = {
        ...this.optionsMsg,
        [convIdKey]: this.searchKeyword,
      };
    }

    this.store.dispatch(
      new conversationActions.Query('all', {
        msg: this.optionsMsg,
        chat: this.optionsChat,
      })
    );
  }

  ngOnInit() {
    // populate from store
    this.typeSelect = [...this.filter.types];
    this.searchById = this.filter.searchById;
    this.idSelect = [...this.filter.idTypes];
    // init lists
    this.listSkills = this.list.skills.collection;
    this.listGroups = this.list.groups.collection;
  }
}
