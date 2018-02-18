import * as actions from './playlist.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlaylistModel } from './playlist.model';

/* tslint:disable:no-empty-interface */
export const playlistAdapter = createEntityAdapter<PlaylistModel>();
export interface State extends EntityState<PlaylistModel> {
  loading: boolean;
  selectedPlaylistId: string;
}
export const initialState: State = playlistAdapter.getInitialState({
  loading: false,
  selectedPlaylistId: null,
});

// Reducer
export function PlaylistReducer(
  state: State = initialState,
  action: actions.AssessmentActions
) {
  switch (action.type) {
    case actions.ADD_ALL:
      return playlistAdapter.addAll(action.data, state);
    case actions.SELECT:
      return {...state, selectedPlaylistId: action.id };
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
const getSelectedPlaylistId = (state: State) =>
  state.selectedPlaylistId;
export const selectPlaylistId = createSelector(
  getPlaylistState,
  getSelectedPlaylistId
);
export const selectPlaylist = createSelector(
  selectEntities,
  selectPlaylistId,
  (playlistEntities, playlistId) => playlistEntities[playlistId]
);
