import * as actions from './playlist.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlaylistModel } from './playlist.model';

export const playlistAdapter = createEntityAdapter<PlaylistModel>();
export interface State extends EntityState<PlaylistModel> {
  loading: boolean;
  updating: boolean;
  selectedPlaylistId: string;
}
export const initialState: State = playlistAdapter.getInitialState({
  loading: false,
  updating: null,
  selectedPlaylistId: null,
});

// Reducer
export function PlaylistReducer(
  state: State = initialState,
  action: actions.AssessmentActions
) {
  switch (action.type) {
    case actions.CREATE:
    case actions.DELETE:
      return { ...state, loading: true, error: false };
    case actions.UPDATE:
      return { ...state, updating: true, error: false };
    case actions.SUCCESS:
      return { ...state, loading: false, updating: false, error: false };
    case actions.ADD_ALL:
      return playlistAdapter.addAll(action.data, state);
    case actions.SELECT:
      return { ...state, selectedPlaylistId: action.id, loading: false };
    case actions.ERROR:
      return { ...state, loading: false, updating: false, error: true };
    default:
      return state;
  }
}

// Create the default selectors
export const getPlaylistState = createFeatureSelector<State>('playlist');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = playlistAdapter.getSelectors(getPlaylistState);

// Create custom selectors
const getSelectedPlaylistId = (state: State) => state.selectedPlaylistId;
const getLoading = (state: State) => state.loading;
const getUpdating = (state: State) => state.updating;
export const selectPlaylistId = createSelector(
  getPlaylistState,
  getSelectedPlaylistId
);
export const selectLoading = createSelector(
  getPlaylistState,
  getLoading
);
export const selectUpdating = createSelector(
  getPlaylistState,
  getUpdating
);
export const selectPlaylist = createSelector(
  selectEntities,
  selectPlaylistId,
  (playlistEntities, playlistId) => playlistEntities[playlistId]
);
