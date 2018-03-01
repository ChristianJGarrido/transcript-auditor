import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  mergeMap,
  map,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { StoreModel } from '../../../app.store';
import * as statsActions from './stats.actions';
import * as fromPlaylist from '../playlist/playlist.reducer';
import * as fromAssessment from '../assessment/assessment.reducer';
import * as fromConversation from '../conversation/conversation.reducer';
import { UtilityService } from '../../services/utility.service';
import { StatsMetrics, StatsModel } from './stats.model';
import { AssessmentModel } from '../assessment/assessment.model';
import { Dictionary } from '@ngrx/entity/src/models';

import * as _ from 'lodash';

@Injectable()
export class StatsEffects {
  // select playlist
  @Effect()
  selectPlaylist$: Observable<Action> = this.actions$
    .ofType<statsActions.SelectPlaylist>(statsActions.SELECT_PLAYLIST)
    .pipe(
      withLatestFrom(this.store.select(fromAssessment.selectAll)),
      map(([action, assessments]) => {
        const { playlists } = action;
        const conversationFilter = playlists.reduce(
          (prev, curr) => [...prev, ...curr.conversationIds],
          []
        );
        const assessmentFilter = assessments.reduce((prev, curr) => {
          return conversationFilter.includes(curr.conversationId)
            ? [...prev, curr.id]
            : prev;
        }, []);
        return new statsActions.UpdateFilters(
          conversationFilter,
          assessmentFilter
        );
      }),
      catchError(err => [new statsActions.Error(err)])
    );

  // build stats
  @Effect()
  stats$: Observable<Action> = this.actions$
    .ofType<statsActions.UpdateFilters>(statsActions.UPDATE_FILTERS)
    .pipe(
      withLatestFrom(
        this.store.select(state => state.stats),
        this.store.select(fromAssessment.selectEntities)
      ),
      map(([action, stats, assessments]) => {
        const metrics = this.buildStats(stats, assessments);
        return new statsActions.UpdateMetrics(metrics);
      }),
      catchError(err => [new statsActions.Error(err)])
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
    private utilityService: UtilityService
  ) {}

  /**
   * builds the metrics given a set of filtered assessments
   * @param {StatsModel} stats
   * @param {Dictionary<AssessmentModel>} assessments
   */
  buildStats(
    stats: StatsModel,
    assessments: Dictionary<AssessmentModel>
  ): StatsMetrics {
    const results = stats.assesmentFilter.reduce(
      (prev, id) => {
        const assessment = assessments[id];
        const { qa, rating, personality, createdBy } = assessment;
        const score = this.utilityService.calculateTotalScore(qa) || 0;
        const person = this.utilityService.calculatePersonality(personality);
        return {
          ...prev,
          createdBy: [...prev.createdBy, createdBy],
          qa: {
            score: prev.qa.score + score,
            count: prev.qa.count + (score > 0 ? 1 : 0),
          },
          rating: {
            score: prev.rating.score + rating,
            count: prev.rating.count + (rating > 0 ? 1 : 0),
          },
          person: {
            score: prev.person.score + Number(person),
            count: prev.person.count + 1,
          },
        };
      },
      {
        createdBy: [],
        qa: { score: 0, count: 0 },
        rating: { score: 0, count: 0 },
        person: { score: 0, count: 0 },
      }
    );
    return {
      playlists: stats.playlistSelect.length,
      assessments:
        stats.assessmentSelect.length || stats.assesmentFilter.length,
      conversations: stats.conversationFilter.length,
      qaScore: results.qa.score / results.qa.count * 100 || 0,
      personality:
        Math.round(results.person.score / results.person.count * 100) || 0,
      rating: results.rating.score / results.rating.count || 0,
      reviewers: _.uniq(results.createdBy).length,
    };
  }
}
