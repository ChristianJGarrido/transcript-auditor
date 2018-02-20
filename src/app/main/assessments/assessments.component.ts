import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AfLoginModel } from '../../shared/store/af-login/af-login.model';
import { ApiLoginModel } from '../../shared/store/api-login/api-login.model';
import { ApiDataModel } from '../../shared/store/api-data/api-data.model';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import * as fromAssessment from '../../shared/store/assessment/assessment.reducer';
import * as fromPlaylist from '../../shared/store/playlist/playlist.reducer';
import { AssessmentModel } from '../../shared/store/assessment/assessment.model';
import { PlaylistModel } from '../../shared/store/playlist/playlist.model';

@Component({
  selector: 'app-assessments',
  templateUrl: './assessments.component.html',
  styleUrls: ['./assessments.component.css'],
})
export class AssessmentsComponent implements OnInit {
  afLogin$: Observable<AfLoginModel>;
  apiLogin$: Observable<ApiLoginModel>;
  apiData$: Observable<ApiDataModel>;

  assessments$: Observable<AssessmentModel[]>;
  playlists$: Observable<PlaylistModel[]>;

  constructor(private store: Store<StoreModel>) {}

  ngOnInit() {
    this.afLogin$ = this.store.select(state => state.afLogin);
    this.apiLogin$ = this.store.select(state => state.apiLogin);
    this.apiData$ = this.store.select(state => state.apiData);

    this.assessments$ = this.store.select(fromAssessment.selectAll);
    this.playlists$ = this.store.select(fromPlaylist.selectAll);
  }
}
