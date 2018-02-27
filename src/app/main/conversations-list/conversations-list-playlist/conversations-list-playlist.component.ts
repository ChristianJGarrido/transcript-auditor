import {
  Component,
  OnInit,
  Input,
  OnChanges,
  HostBinding,
} from '@angular/core';
import { PlaylistModel } from '../../../shared/store/playlist/playlist.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../../app.store';
import * as playlistActions from '../../../shared/store/playlist/playlist.actions';

import {
  IMultiSelectOption,
  IMultiSelectSettings,
  IMultiSelectTexts,
} from 'angular-2-dropdown-multiselect';

@Component({
  selector: 'app-conversations-list-playlist',
  templateUrl: './conversations-list-playlist.component.html',
  styleUrls: ['./conversations-list-playlist.component.css'],
})
export class ConversationsListPlaylistComponent implements OnInit, OnChanges {
  @HostBinding('class') class = 'col';
  @Input() playlists: PlaylistModel[];
  @Input() playlistSelect: PlaylistModel;
  @Input() selected: number;
  @Input() conversationListIds: string[];

  playlistOptions: IMultiSelectOption[] = [];
  playlistSelectIds: string[] = [];
  playlistSettings: IMultiSelectSettings = {
    enableSearch: true,
    buttonClasses: 'btn btn-outline-secondary btn-sm',
    dynamicTitleMaxItems: 1,
    selectionLimit: 1,
    minSelectionLimit: 1,
    autoUnselect: true,
    closeOnSelect: true,
  };
  playlistTexts: IMultiSelectTexts = {
    defaultTitle: 'Select Playlist',
  };
  playlistName = '';

  constructor(private store: Store<StoreModel>) {}

  /**
   * Creates a new playlist with a new name
   */
  createPlaylist(): void {
    this.store.dispatch(new playlistActions.Create(this.playlistName));
    this.playlistName = '';
  }

  /**
   * Updates an exsiting playlist with selected conversation ids
   */
  updatePlaylist(): void {
    const id = this.playlistSelectIds[0];
    this.store.dispatch(
      new playlistActions.Update(id, {
        conversationIds: this.conversationListIds,
      })
    );
  }

  /**
   * Selects an existing playlist
   */
  selectPlaylist(): void {
    const id = this.playlistSelectIds[0];
    this.store.dispatch(new playlistActions.Select(id));
  }

  /**
   * Update dropdown options
   * @return {IMultiSelectOption[]}
   */
  updateOptions(): IMultiSelectOption[] {
    return [
      { id: null, name: 'Create new' },
      { id: 'label', name: 'Select Existing', isLabel: true },
      ...this.playlists,
    ];
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.playlistOptions = this.updateOptions();
    if (this.playlistSelect) {
      this.playlistSelectIds = [this.playlistSelect.id];
    } else {
      this.playlistSelectIds = [null];
    }
  }
}
