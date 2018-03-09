import * as filterActions from './filter.actions';
import { FilterState, FilterModel } from './filter.model';

export type Action = filterActions.All;

const initialFilterState = new FilterState();

export function FilterReducer(
  state: FilterModel = initialFilterState,
  action: Action
): FilterModel {
  switch (action.type) {
    case filterActions.TOGGLE_CONVERSATION_TYPES:
      return {
        ...state,
        types: [...action.types],
      };
    case filterActions.TOGGLE_ID_TYPE:
      return {
        ...state,
        idTypes: [...action.idTypes],
      };
    case filterActions.TOGGLE_SEARCH_BY:
      return {
        ...state,
        searchById: action.searchById,
      };
    case filterActions.RESET:
      return initialFilterState;
    default:
      return state;
  }
}
