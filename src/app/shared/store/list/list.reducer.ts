import * as listActions from './list.actions';
import { ListState, ListModel } from './list.model';

export type Action = listActions.All;

const initialListState = new ListState();

const entityCreator = (list: any[]) => {
  const entity = { entities: {}, ids: [], collection: [] };
  list.forEach(item => {
    entity.entities[item.id] = item;
    entity.ids.push(item.id);
    entity.collection.push(item);
  });
  return entity;
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
