import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import {
  ApiConversationHistoryRecord,
  ApiOptions,
} from '../../shared/interfaces/interfaces';

import { DatatableComponent } from '@swimlane/ngx-datatable';
import { ConversationModel } from '../../shared/store/conversation/conversation.model';
import * as fromConversation from '../../shared/store/conversation/conversation.reducer';
import * as fromPlaylist from '../../shared/store/playlist/playlist.reducer';
import * as conversationActions from '../../shared/store/conversation/conversation.actions';
import * as playlistActions from '../../shared/store/playlist/playlist.actions';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import { MatDrawer } from '@angular/material/sidenav';
import { PlaylistModel } from '../../shared/store/playlist/playlist.model';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css'],
})
export class ConversationsListComponent implements OnInit, OnChanges {
  @ViewChild('table') table: DatatableComponent;
  // TODO properly type the conversation inputs
  @Input() playlistState: fromPlaylist.State;
  @Input() playlists: PlaylistModel[];
  @Input() playlistSelect: PlaylistModel;
  @Input() conversations: any[] = [];
  @Input() sideNavList: MatDrawer;
  @Input() conversationState: fromConversation.State;

  scope = { preserve: [], change: [] };

  selected = [];
  rows = [];
  columns = [];

  constructor(private store: Store<StoreModel>) {}

  /**
   * selects an individual conversation
   * @param {any} event
   */
  selectConversation(event: any): void {
    if (event.type === 'click') {
      const id = event.row.conversationId;
      this.store.dispatch(new conversationActions.Select(id));
    }
  }

  /**
   * adds conversation to local selected list
   * @param {any} selected
   */
  onCheck({ selected }): void {
    // update selected
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
    // get ids to preserve and change
    this.scope = this.getScope();
    const preserveIds = this.scope.preserve;
    const changeIds = selected.map(select => select.conversationId);
    const ids = [...preserveIds, ...changeIds];
    this.store.dispatch(new conversationActions.FilterPlaylist(ids));
  }

  /**
   * refresh selected rows
   */
  updateSelect(): void {
    this.scope = this.getScope();
    const change = this.scope.change.join(',');
    const selected = this.rows.filter(row =>
      change.includes(row.conversationId)
    );
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
  }

  /**
   * refresh data grid rows
   * @return {any[]}
   */
  updateRows(): any[] {
    return this.conversations.map(conv => {
      const record = conv.messageRecords && conv.messageRecords[0];
      const data = record && record.messageData;
      const message = (data && data.msg && data.msg.text) || '';
      return {
        ...conv.info,
        message,
      };
    });
  }

  /**
   * gets ids to preserve and change
   * preserved ids are ids not visible in data rows
   */
  getScope(): { preserve: string[]; change: string[] } {
    const ids = this.conversationState.playlistIds;
    const idsToChange = this.rows.map(row => row.conversationId).join(',');
    return ids.reduce(
      (prev, id) => {
        const scope = idsToChange.includes(id) ? 'change' : 'preserve';
        return {
          ...prev,
          [scope]: [...prev[scope], id],
        };
      },
      { preserve: [], change: [] }
    );
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    // refresh rows
    this.rows = this.updateRows();
    // update selected
    this.updateSelect();
  }
}
