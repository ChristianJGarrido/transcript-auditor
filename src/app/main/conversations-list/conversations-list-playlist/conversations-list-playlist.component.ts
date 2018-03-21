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
import * as fromPlaylist from '../../../shared/store/playlist/playlist.reducer';

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
  @Input() playlistState: fromPlaylist.State;
  @Input() playlistSelect: PlaylistModel;
  @Input() selected: number;
  @Input() conversationListIds: string[];
  @Input() scope: { change: string[]; preserve: string[] };

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

  confirm = false;
  rename = false;

  constructor(private store: Store<StoreModel>) {}

  /**
   * returns true if needs updating
   * @return {boolean}
   */
  needUpdate(): boolean {
    return this.countUpdate() !== 0;
  }

  /**
   * deletes selected playlist
   */
  deletePlaylist(): void {
    const { id } = this.playlistSelect;
    this.store.dispatch(new playlistActions.Select(null));
    this.store.dispatch(new playlistActions.Delete(id));
    this.confirm = false;
  }

  /**
   * updates playlist nmae
   */
  renamePlaylist(): void {
    const { id } = this.playlistSelect;
    this.store.dispatch(new playlistActions.Update(id, { name: this.playlistName }));
    this.rename = false;
    this.playlistName = '';
  }

  /**
   * returns the numerical difference between two arrays
   * @param {string[]} first
   * @param {string[]} second
   * @return {number}
   */
  checkDifference(first: string[], second: string[]): number {
    const test = (one: string[], two: string[]) =>
      one.filter(item => !two.join(',').includes(item));
    const testFirst = test(first, second).length;
    const testSecond = test(second, first).length;
    return testFirst + testSecond;
  }

  /**
   * counts the difference for updating
   * @return {number}
   */
  countUpdate(): number {
    if (this.playlistSelect) {
      const scope = [...this.scope.change, ...this.scope.preserve];
      const saved = this.playlistSelect.conversationIds;
      return this.checkDifference(scope, saved);
    }
    return 0;
  }

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
    const { id } = this.playlistSelect;
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
    const options = this.playlists.length
      ? [
          { id: 'label', name: 'Select Existing', isLabel: true },
          ...this.playlists,
        ]
      : [];
    return [{ id: null, name: 'Create new' }, ...options];
  }

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.playlistOptions = this.updateOptions();
    if (this.playlistSelect) {
      this.playlistSelectIds = [this.playlistSelect.id];
    } else {
      this.playlistSelectIds = [null];
    }
  }
}
