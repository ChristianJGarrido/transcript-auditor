import * as listActions from './list.actions';
import { ListState, ListModel } from './list.model';

export type Action = listActions.All;

const initialListState = new ListState();

export function ListReducer(
  state: ListModel = initialListState,
  action: Action
): ListModel {
  switch (action.type) {
    case listActions.QUERY:
      return {
        ...state,
      };
    case listActions.ADD_AGENTS:
      return {
        ...state,
        agents: action.agents,
      };
    case listActions.ADD_SKILLS:
      return {
        ...state,
        skills: action.skills,
      };
    case listActions.ADD_GROUPS:
      return {
        ...state,
        groups: action.groups,
      };
    case listActions.RESET:
      return initialListState;
    default:
      return state;
  }
}
