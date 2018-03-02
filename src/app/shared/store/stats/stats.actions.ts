import { Action } from '@ngrx/store';
import { StatsModel, StatsMetrics } from './stats.model';
import { PlaylistModel } from '../playlist/playlist.model';
import { AssessmentModel } from '../assessment/assessment.model';

export const SELECT_PLAYLIST = '[Stats] Select playlist';
export const SELECT_ASSESSMENT = '[Stats] Select assessment';
export const UPDATE_FILTERS = '[Stats] Update filters';
export const BUILD = '[Stats] Build';
export const UPDATE_METRICS = '[Stats] Update metrics';
export const ERROR = '[Stats] Error';

export class SelectPlaylist implements Action {
  readonly type = SELECT_PLAYLIST;
  constructor(public playlists: PlaylistModel[]) {}
}
export class SelectAssessment implements Action {
  readonly type = SELECT_ASSESSMENT;
  constructor(public assessments: AssessmentModel[]) {}
}
export class UpdateFilters implements Action {
  readonly type = UPDATE_FILTERS;
  constructor(public conversations: string[], public assessments: string[]) {}
}
export class Build implements Action {
  readonly type = BUILD;
}
export class UpdateMetrics implements Action {
  readonly type = UPDATE_METRICS;
  constructor(public metrics: StatsMetrics) {}
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}

export type All =
  | SelectPlaylist
  | SelectAssessment
  | Build
  | UpdateFilters
  | UpdateMetrics
  | Error;
