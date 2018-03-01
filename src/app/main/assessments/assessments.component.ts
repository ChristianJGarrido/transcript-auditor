import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AfLoginModel } from '../../shared/store/af-login/af-login.model';
import { ApiLoginModel } from '../../shared/store/api-login/api-login.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import * as fromAssessment from '../../shared/store/assessment/assessment.reducer';
import * as fromPlaylist from '../../shared/store/playlist/playlist.reducer';
import { AssessmentModel } from '../../shared/store/assessment/assessment.model';
import { PlaylistModel } from '../../shared/store/playlist/playlist.model';
import { StatsModel } from '../../shared/store/stats/stats.model';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AssessmentsComponent implements OnInit {
  afLogin$: Observable<AfLoginModel>;
  apiLogin$: Observable<ApiLoginModel>;

  assessments$: Observable<AssessmentModel[]>;
  assessmentState$: Observable<fromAssessment.State>;
  playlists$: Observable<PlaylistModel[]>;
  playlistState$: Observable<fromPlaylist.State>;

  stats$: Observable<StatsModel>;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit() {
    this.afLogin$ = this.store.select(state => state.afLogin);
    this.apiLogin$ = this.store.select(state => state.apiLogin);

    this.assessments$ = this.store.select(fromAssessment.selectAll);
    this.assessmentState$ = this.store.select(fromAssessment.getState);
    this.playlists$ = this.store.select(fromPlaylist.selectAll);
    this.playlistState$ = this.store.select(fromPlaylist.getState);

    this.stats$ = this.store.select(state => state.stats);
  }
}
