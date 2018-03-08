import {
  Component,
  OnInit,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';

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
import { ApiChatHistoryRecord } from '../../shared/interfaces/chat';
import { ApiConversationHistoryRecord } from '../../shared/interfaces/conversation';
import { AssessmentModel } from '../../shared/store/assessment/assessment.model';
import { ListModel } from '../../shared/store/list/list.model';
import { FilterModel } from '../../shared/store/filter/filter.model';

@Component({
  selector: 'app-conversations-list',
  templateUrl: './conversations-list.component.html',
  styleUrls: ['./conversations-list.component.css'],
})
export class ConversationsListComponent implements OnInit, OnChanges {
  @ViewChild('table') table: DatatableComponent;
  @Input() list: ListModel;
  @Input() filter: FilterModel;
  @Input() playlistState: fromPlaylist.State;
  @Input() playlists: PlaylistModel[];
  @Input() playlistSelect: PlaylistModel;
  @Input() assessments: AssessmentModel[];
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
      const { id } = event.row;
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
    const { preserve } = this.scope;
    const changeIds = selected.map(select => select.id);
    const ids = [...preserve, ...changeIds];
    this.store.dispatch(new conversationActions.FilterPlaylist(ids));
  }

  /**
   * refresh selected rows
   */
  updateSelect(): void {
    this.scope = this.getScope();
    const { change } = this.scope;
    const selected = this.rows.filter(row => change.includes(row.id));
    this.selected.splice(0, this.selected.length);
    this.selected = [...selected];
  }

  /**
   * returns chat text
   * @param {ApiChatHistoryRecord} record
   */
  getChatData(record: ApiChatHistoryRecord, data: string): string {
    switch (data) {
      case 'text':
        const line = record.transcript.lines[0];
        return line.text || '';
      case 'conId':
        return record.info.visitorId;
    }
  }

  /**
   * returns conversation data
   * @param {ApiConversationHistoryRecord} record
   */
  getConversationData(
    record: ApiConversationHistoryRecord,
    data: string
  ): string {
    switch (data) {
      case 'text':
        const lines = record.messageRecords && record.messageRecords[0];
        const msgData = lines && lines.messageData;
        return (msgData.msg && msgData.msg.text) || '';
      case 'conId':
        const participant = record.consumerParticipants[0];
        return participant && participant.participantId;
    }
  }

  /**
   * counts times conv id appears in assessments
   * @param {string} id
   * @return {number}
   */
  countAssessments(id: string): number {
    return this.assessments.filter(item => item.conversationId === id).length;
  }

  /**
   * refresh data grid rows
   * @return {any[]}
   */
  updateRows(): any[] {
    return this.conversations.map(conv => {
      const { isChat, id } = conv;
      const message = isChat
        ? this.getChatData(conv, 'text')
        : this.getConversationData(conv, 'text');
      const conId = isChat
        ? this.getChatData(conv, 'conId')
        : this.getConversationData(conv, 'conId');
      return {
        ...conv.info,
        isChat,
        id,
        conId,
        message,
        assessmentCount: this.countAssessments(id),
      };
    });
  }

  /**
   * gets ids to preserve and change
   * preserved ids are ids not visible in data rows
   */
  getScope(): { preserve: string[]; change: string[] } {
    const { playlistIds } = this.conversationState;
    const idsToChange = this.rows.map(row => row.id).join(',');
    return playlistIds.reduce(
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
