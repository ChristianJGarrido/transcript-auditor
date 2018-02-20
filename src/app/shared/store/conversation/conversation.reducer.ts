import * as actions from './conversation.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ConversationModel } from './conversation.model';

export const adapter = createEntityAdapter<ConversationModel>();
export interface State extends EntityState<ConversationModel> {
  loading: boolean;
  updating: boolean;
  error: boolean;
  selectedId: string;
}
export const initialState: State = adapter.getInitialState({
  loading: false,
  updating: null,
  error: false,
  selectedId: null,
});

// Reducer
export function ConversationReducer(
  state: State = initialState,
  action: actions.ConversationActions
): State {
  switch (action.type) {
    case actions.QUERY:
      return { ...state, loading: true, error: false };
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
export const getState = createFeatureSelector<State>('conversation');
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors(getState);

// Create custom selectors
const getSelectedId = (state: State) => state.selectedId;
export const selectId = createSelector(getState, getSelectedId);
export const selectConversation = createSelector(
  selectEntities,
  selectId,
  (entities, id) => entities[id]
);
