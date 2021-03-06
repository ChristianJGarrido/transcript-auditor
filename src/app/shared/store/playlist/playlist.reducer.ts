import * as actions from './playlist.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlaylistModel } from './playlist.model';

export const adapter = createEntityAdapter<PlaylistModel>();
export interface State extends EntityState<PlaylistModel> {
  ids: string[];
  loading: boolean;
  error: boolean;
  updating: boolean;
  selectedId: string;
}
export const initialState: State = adapter.getInitialState({
  ids: [],
  loading: false,
  error: false,
  updating: null,
  selectedId: null,
});

// Reducer
export function PlaylistReducer(
  state: State = initialState,
  action: actions.AssessmentActions
): State {
  switch (action.type) {
    case actions.CREATE:
    case actions.DELETE:
      return { ...state, loading: true, error: false };
    case actions.UPDATE:
      return { ...state, updating: true, error: false };
    case actions.SUCCESS:
      return { ...state, loading: false, updating: false, error: false };
    case actions.ADD_ALL:
      return adapter.addAll(action.playlists, state);
    case actions.SELECT:
      return { ...state, selectedId: action.id, loading: false };
    case actions.ERROR:
      return { ...state, loading: false, updating: false, error: true };
    case actions.RESET:
      return initialState;
    default:
      return state;
  }
}

// Create the default selectors
export const getState = createFeatureSelector<State>('playlist');
export const {
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getState);

// Create custom selectors
const getSelectedId = (state: State) => state.selectedId;
const getIds = (state: State) => state.ids;
export const selectId = createSelector(getState, getSelectedId);
export const selectIds = createSelector(getState, getIds);
export const selectOne = createSelector(
  selectEntities,
  selectId,
  (entities, id) => entities[id]
);
