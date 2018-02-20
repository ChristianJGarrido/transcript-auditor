import * as actions from './playlist.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { PlaylistModel } from './playlist.model';

export const adapter = createEntityAdapter<PlaylistModel>();
export interface State extends EntityState<PlaylistModel> {
  loading: boolean;
  error: boolean;
  updating: boolean;
  selectedId: string;
}
export const initialState: State = adapter.getInitialState({
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
      return adapter.addAll(action.data, state);
    case actions.SELECT:
      return { ...state, selectedId: action.id.toString(), loading: false };
    case actions.ERROR:
      return { ...state, loading: false, updating: false, error: true };
    default:
      return state;
  }
}

// Create the default selectors
export const getState = createFeatureSelector<State>('playlist');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getState);

// Create custom selectors
const getSelectedId = (state: State) => state.selectedId;
export const selectId = createSelector(getState, getSelectedId);
export const selectPlaylist = createSelector(
  selectEntities,
  selectId,
  (entities, id) => entities[id]
);
