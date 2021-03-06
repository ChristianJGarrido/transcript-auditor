import {
  Component,
  OnInit,
  Input,
  OnChanges,
} from '@angular/core';
import { ConversationModel } from '../../store/conversation/conversation.model';
import * as playlistActions from '../../store/playlist/playlist.actions';
import * as conversationActions from '../../store/conversation/conversation.actions';
import * as exporterActions from '../../store/exporter/exporter.actions';
import * as fromPlaylist from '../../store/playlist/playlist.reducer';
import { PlaylistModel } from '../../store/playlist/playlist.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts,
} from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-transcript-control',
  templateUrl: './transcript-control.component.html',
  styleUrls: ['./transcript-control.component.css'],
})
export class TranscriptControlComponent implements OnInit, OnChanges {
  @Input() conversationSelect: ConversationModel;
  @Input() playlistSelect: PlaylistModel;
  @Input() playlistState: fromPlaylist.State;
  @Input() playlists: PlaylistModel[];
  @Input() messageEvents: any[];

  playlistOptions: IMultiSelectOption[] = [];
  playlistSelectIds: string[] = [];
  playlistSettings: IMultiSelectSettings = {
    enableSearch: true,
    buttonClasses: 'btn btn-outline-secondary btn-sm py-0',
    fixedTitle: true,
    selectionLimit: 1,
    minSelectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true,
  };
  playlistTexts: IMultiSelectTexts = {
    defaultTitle: 'Add to Playlist',
  };
  playlistName = '';
  playlistAdd = false;

  confirm = false;

  constructor(
    private store: Store<StoreModel>,
  ) {}

  /**
   * Exports conversation to PDF
   */
  exportPdf(): void {
    const element = document.getElementById('message-container');
    this.store.dispatch(new exporterActions.CreatePdf(element));
  }

  /**
   * Updates an exsiting playlist with selected conversation ids
   * @param {string} playlistId
   */
  updatePlaylist(playlistId: string): void {
    const playlist = this.playlists.find(item => item.id === playlistId);
    if (playlist) {
      const conversationListIds = playlist.conversationIds;
      const { id } = this.conversationSelect;
      const exist = conversationListIds.includes(id);
      if (!exist) {
        const conversationIds = [...conversationListIds, id];
        this.store.dispatch(
          new playlistActions.Update(playlistId, { conversationIds })
        );
      }
    }
  }

  // looks for conv id in playlist
  conversationIndex(): number {
    const convId = this.conversationSelect.id;
    const convIds = this.playlistSelect.conversationIds;
    return convIds.indexOf(convId);
  }

  // removes conversation from playlist
  removeFromPlaylist(): void {
    const playlistId = this.playlistSelect.id;
    const convIds = this.playlistSelect.conversationIds;
    const index = this.conversationIndex();
    if (index !== -1) {
      const conversationIds = [
        ...convIds.slice(0, index),
        ...convIds.slice(index + 1),
      ];
      this.store.dispatch(
        new playlistActions.Update(playlistId, { conversationIds })
      );
      this.store.dispatch(
        new conversationActions.FilterPlaylist(conversationIds)
      );
    }
    this.confirm = false;
  }

  ngOnInit() {}

  ngOnChanges() {
    this.playlistOptions = this.playlists;
  }
}
