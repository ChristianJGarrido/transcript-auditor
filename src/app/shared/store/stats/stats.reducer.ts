import * as statsActions from './stats.actions';
import { StatsState, StatsModel } from './stats.model';

export type Action = statsActions.All;

const initialApiLoginState = new StatsState();

export function StatsReducer(
  state: StatsModel = initialApiLoginState,
  action: Action
): StatsModel {
  switch (action.type) {
    case statsActions.SELECT_ASSESSMENT:
      return {
        ...state,
        assessmentSelect: action.assessments,
      };
    case statsActions.SELECT_PLAYLIST:
      return {
        ...state,
        playlistSelect: action.playlists,
      };
    case statsActions.UPDATE_FILTERS:
      return {
        ...state,
        conversationFilter: action.conversations,
        assesmentFilter: action.assessments,
      };
    case statsActions.UPDATE_METRICS:
      return {
        ...state,
        metrics: action.metrics,
      };
    default:
      return state;
  }
}
