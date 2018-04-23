import * as actions from './assessment.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AssessmentModel } from './assessment.model';

export const adapter = createEntityAdapter<AssessmentModel>();
export interface State extends EntityState<AssessmentModel> {
  ids: string[];
  loading: boolean;
  updating: boolean;
  error: boolean;
  selectedId: string;
  idsByConversation: string[];
  idsByPlaylist: string[];
}
export const initialState: State = adapter.getInitialState({
  ids: [],
  loading: false,
  updating: null,
  error: false,
  selectedId: null,
  idsByConversation: [],
  idsByPlaylist: [],
});

// Reducer
export function AssessmentReducer(
  state: State = initialState,
  action: actions.AssessmentActions
): State {
  switch (action.type) {
    case actions.FILTER:
      return {
        ...state,
        idsByConversation: action.idsByConversation,
        idsByPlaylist: action.idsByPlaylist,
      };
    case actions.CREATE:
    case actions.DELETE:
      return { ...state, loading: true, error: false };
    case actions.UPDATE:
      return { ...state, updating: true, error: false };
    case actions.SUCCESS:
      return { ...state, loading: false, updating: false, error: false };
    case actions.ADD_ALL:
      return adapter.addAll(action.assessments, state);
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
export const getState = createFeatureSelector<State>('assessment');
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
