import * as listActions from './list.actions';
import { ListState, ListModel } from './list.model';

export type Action = listActions.All;

const initialListState = new ListState();

const entityCreator = <T>(list: any[]): T => {
  return list.reduce(
    (prev, item) => {
      return {
        entities: {
          ...prev.entities,
          [item.id]: item,
        },
        ids: [...prev.ids, item.id],
        collection: [...prev.collection, item]
      };
    },
    { entities: {}, ids: [], collection: [] }
  );
};

export function ListReducer(
  state: ListModel = initialListState,
  action: Action
): ListModel {
  switch (action.type) {
    case listActions.ADD_AGENTS:
      return {
        ...state,
        agents: entityCreator(action.agents),
      };
    case listActions.ADD_SKILLS:
      return {
        ...state,
        skills: entityCreator(action.skills),
      };
    case listActions.ADD_GROUPS:
      return {
        ...state,
        groups: entityCreator(action.groups),
      };
    case listActions.RESET:
      return initialListState;
    default:
      return state;
  }
}
