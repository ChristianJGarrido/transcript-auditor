import * as filterActions from './filter.actions';
import { FilterState, FilterModel } from './filter.model';

export type Action = filterActions.All;

const initialFilterState = new FilterState();

export function FilterReducer(
  state: FilterModel = initialFilterState,
  action: Action
): FilterModel {
  switch (action.type) {
    case filterActions.TOGGLE_TYPES:
      return {
        ...state,
        types: [...action.types]
      };
    case filterActions.RESET:
      return initialFilterState;
    default:
      return state;
  }
}
