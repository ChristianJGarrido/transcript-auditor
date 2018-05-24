import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { StoreModel } from '../app.store';
import * as ApiLoginActions from '../shared/store/api-login/api-login.actions';
import * as fromConversation from '../shared/store/conversation/conversation.reducer';
import * as fromPlaylist from '../shared/store/playlist/playlist.reducer';
import * as fromAssessment from '../shared/store/assessment/assessment.reducer';
import { ConversationModel } from '../shared/store/conversation/conversation.model';
import { ApiLoginModel } from '../shared/store/api-login/api-login.model';
import { PlaylistModel } from '../shared/store/playlist/playlist.model';
import { AssessmentModel } from '../shared/store/assessment/assessment.model';
import { ListModel } from '../shared/store/list/list.model';
import { FilterModel } from '../shared/store/filter/filter.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  list$: Observable<ListModel>;
  filter$: Observable<FilterModel>;
  apiLogin$: Observable<ApiLoginModel>;
  conversations$: Observable<ConversationModel[]>;
  conversationState$: Observable<fromConversation.State>;
  playlists$: Observable<PlaylistModel[]>;
  playlistState$: Observable<fromPlaylist.State>;
  playlistSelect$: Observable<PlaylistModel>;
  assessments$: Observable<AssessmentModel[]>;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit(): void {
    this.store.dispatch(new ApiLoginActions.GetSession());

    this.list$ = this.store.select(state => state.list);
    this.filter$ = this.store.select(state => state.filter);

    this.apiLogin$ = this.store.select(state => state.apiLogin);

    this.conversations$ = this.store.select(fromConversation.selectAll);
    this.conversationState$ = this.store.select(fromConversation.getState);

    this.playlists$ = this.store.select(fromPlaylist.selectAll);
    this.playlistState$ = this.store.select(fromPlaylist.getState);
    this.playlistSelect$ = this.store.select(fromPlaylist.selectOne);

    this.assessments$ = this.store.select(fromAssessment.selectAll);
  }

  ngAfterViewInit(): void {}
}
