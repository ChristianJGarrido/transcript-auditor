import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { AfLoginModel } from '../../shared/store/af-login/af-login.model';
import { ApiLoginModel } from '../../shared/store/api-login/api-login.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';

import * as fromAssessment from '../../shared/store/assessment/assessment.reducer';
import * as fromPlaylist from '../../shared/store/playlist/playlist.reducer';
import * as fromConversation from '../../shared/store/conversation/conversation.reducer';
import { AssessmentModel } from '../../shared/store/assessment/assessment.model';
import { PlaylistModel } from '../../shared/store/playlist/playlist.model';
import { ConversationModel } from '../../shared/store/conversation/conversation.model';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit {
  afLogin$: Observable<AfLoginModel>;
  apiLogin$: Observable<ApiLoginModel>;

  conversationState$: Observable<fromConversation.State>;
  conversations$: Observable<ConversationModel[]>;
  conversationSelect$: Observable<ConversationModel>;

  assessmentState$: Observable<fromAssessment.State>;
  assessmentSelect$: Observable<AssessmentModel>;

  playlistState$: Observable<fromPlaylist.State>;
  playlists$: Observable<PlaylistModel[]>;
  playlistSelect$: Observable<PlaylistModel>;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit() {
    this.afLogin$ = this.store.select(state => state.afLogin);
    this.apiLogin$ = this.store.select(state => state.apiLogin);

    this.conversationState$ = this.store.select(fromConversation.getState);
    this.conversations$ = this.store.select(fromConversation.selectAll);
    this.conversationSelect$ = this.store.select(fromConversation.selectOne);

    this.assessmentState$ = this.store.select(fromAssessment.getState);
    this.assessmentSelect$ = this.store.select(fromAssessment.selectOne);

    this.playlistState$ = this.store.select(fromPlaylist.getState);
    this.playlists$ = this.store.select(fromPlaylist.selectAll);
    this.playlistSelect$ = this.store.select(fromPlaylist.selectOne);
  }
}
