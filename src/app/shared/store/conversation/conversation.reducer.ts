import * as actions from './conversation.actions';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ConversationModel } from './conversation.model';

export const adapter = createEntityAdapter<ConversationModel>();
export interface State extends EntityState<ConversationModel> {
  loading: boolean;
  updating: boolean;
  selectedId: string;
  playlistIds: string[];
}
export const initialState: State = adapter.getInitialState({
  loading: false,
  updating: null,
  selectedId: null,
  playlistIds: [],
});

// Reducer
export function ConversationReducer(
  state: State = initialState,
  action: actions.ConversationActions
): State {
  switch (action.type) {
    case actions.QUERY:
      return { ...state, loading: true };
    case actions.SUCCESS_SELECT:
    case actions.SUCCESS_ADD:
    case actions.ERROR:
      return { ...state, loading: false, updating: false };
    case actions.ADD_ALL:
      return adapter.addAll(action.conversations, state);
    case actions.ADD_ONE:
      return adapter.addOne(action.conversation, state);
    case actions.ADD_MANY:
      return adapter.addMany(action.conversations, state);
    case actions.SELECT:
      return { ...state, selectedId: action.id, loading: false };
    case actions.FILTER_PLAYLIST:
      return { ...state, playlistIds: action.ids, loading: false };
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
const getPlaylistIds = (state: State) => state.playlistIds;
export const selectId = createSelector(getState, getSelectedId);
export const selectPlaylistIds = createSelector(getState, getPlaylistIds);
export const selectOne = createSelector(
  selectEntities,
  selectId,
  (entities, id) => entities[id]
);
