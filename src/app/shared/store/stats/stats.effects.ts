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
import * as playlistActions from '../playlist/playlist.actions';
import * as fromAssessment from '../assessment/assessment.reducer';
import * as assessmentActions from '../assessment/assessment.actions';
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
    .ofType(
      statsActions.UPDATE_FILTERS,
      statsActions.BUILD,
      assessmentActions.ADD_ALL,
      playlistActions.ADD_ALL,
      statsActions.SELECT_ASSESSMENT
    )
    .pipe(
      withLatestFrom(
        this.store.select(state => state.stats),
        this.store.select(fromAssessment.selectIds),
        this.store.select(fromAssessment.selectEntities),
        this.store.select(fromPlaylist.selectIds),
      ),
      map(([action, stats, assessmentIds, assessmentEntities, playlistIds]) => {
        const metrics = this.buildStats(
          stats,
          assessmentIds,
          assessmentEntities,
          playlistIds
        );
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
    ids: string[] | number[],
    entities: Dictionary<AssessmentModel>,
    playlistIds: string[] | number[]
  ): StatsMetrics {
    const statsArray = stats.assessmentSelect.length
      ? stats.assessmentSelect.map(item => item.id)
      : stats.assesmentFilter;
    const arrayToUse = statsArray.length ? statsArray : [...ids];
    const results = arrayToUse.reduce(
      (prev, id) => {
        const assessment = entities[id];
        const { qa, rating, personality, createdBy } = assessment;
        const qaScore = this.utilityService.aggregateQaTotal(prev.qaScore, qa);
        const person = this.utilityService.calculatePersonality(personality);
        return {
          ...prev,
          qaScore,
          createdBy: [...prev.createdBy, createdBy],
          rating: {
            sum: prev.rating.sum + rating,
            count: prev.rating.count + (rating > 0 ? 1 : 0),
          },
          person: {
            sum: prev.person.sum + Number(person),
            count: prev.person.count + 1,
          },
        };
      },
      {
        createdBy: [],
        qaScore: {
          group: {},
          score: 0,
          count: 0,
          sum: 0,
        },
        rating: { sum: 0, count: 0 },
        person: { sum: 0, count: 0 },
      }
    );

    return {
      playlists: stats.playlistSelect.length || playlistIds.length,
      assessments: arrayToUse.length,
      conversations: stats.conversationFilter.length,
      qaScore: results.qaScore.score || 0,
      qaGroup: results.qaScore.group,
      personality: results.person.sum / results.person.count || 0,
      rating: results.rating.sum / results.rating.count || 0,
      reviewers: _.uniq(results.createdBy).length,
    };
  }
}
