import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { StoreModel } from '../app.store';
import * as ApiLoginActions from '../shared/store/api-login/api-login.actions';
import * as fromConversation from '../shared/store/conversation/conversation.reducer';
import * as fromPlaylist from '../shared/store/playlist/playlist.reducer';
import { ConversationModel } from '../shared/store/conversation/conversation.model';
import { ApiLoginModel } from '../shared/store/api-login/api-login.model';
import { PlaylistModel } from '../shared/store/playlist/playlist.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  apiLogin$: Observable<ApiLoginModel>;
  conversations$: Observable<ConversationModel[]>;
  conversationState$: Observable<fromConversation.State>;
  playlists$: Observable<PlaylistModel[]>;
  playlistState$: Observable<fromPlaylist.State>;
  playlistSelect$: Observable<PlaylistModel>;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit(): void {
    this.store.dispatch(new ApiLoginActions.GetSession());
    this.apiLogin$ = this.store.select(state => state.apiLogin);

    this.conversations$ = this.store.select(fromConversation.selectAll);
    this.conversationState$ = this.store.select(fromConversation.getState);

    this.playlists$ = this.store.select(fromPlaylist.selectAll);
    this.playlistState$ = this.store.select(fromPlaylist.getState);
    this.playlistSelect$ = this.store.select(fromPlaylist.selectOne);
  }

  ngAfterViewInit(): void {}
}
