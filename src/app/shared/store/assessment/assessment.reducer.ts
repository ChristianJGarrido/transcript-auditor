import * as actions from './assessment.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AssessmentModel } from './assessment.model';

export const adapter = createEntityAdapter<AssessmentModel>();
export interface State extends EntityState<AssessmentModel> {
  loading: boolean;
  updating: boolean;
  error: boolean;
  selectedId: string;
  conversationIds: string[];
}
export const initialState: State = adapter.getInitialState({
  loading: false,
  updating: null,
  error: false,
  selectedId: null,
  conversationIds: [],
});

// Reducer
export function AssessmentReducer(
  state: State = initialState,
  action: actions.AssessmentActions
): State {
  switch (action.type) {
    case actions.FILTER_CONVERSATION:
    return { ...state, conversationIds: action.data };
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
      return { ...state, selectedId: action.id && action.id.toString(), loading: false };
    case actions.ERROR:
      return { ...state, loading: false, updating: false, error: true };
    default:
      return state;
  }
}

// Create the default selectors
export const getState = createFeatureSelector<State>('assessment');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getState);

// Create custom selectors
const getSelectedId = (state: State) => state.selectedId;
const getConversationIds = (state: State) => state.conversationIds;
export const selectId = createSelector(getState, getSelectedId);
export const selectConversationIds = createSelector(getState, getConversationIds);
export const selectOne = createSelector(
  selectEntities,
  selectId,
  (entities, id) => entities[id]
);
export const selectConversation = createSelector(
  selectEntities,
  selectConversationIds,
  (entities, ids) => ids.map(id => entities[id])
);
