import { Action } from '@ngrx/store';
import { ListModel } from './list.model';

export const QUERY = '[List] Query';
export const ADD_AGENTS = '[List] Add agents';
export const ADD_SKILLS = '[List] Add skills';
export const ADD_GROUPS = '[List] Add groups';
export const ERROR = '[List] Error';
export const RESET = '[List] Reset';

export class Query implements Action {
  readonly type = QUERY;
}
export class AddAgents implements Action {
  readonly type = ADD_AGENTS;
  constructor(public agents: any[]) {}
}
export class AddSkills implements Action {
  readonly type = ADD_SKILLS;
  constructor(public skills: any[]) {}
}
export class AddGroups implements Action {
  readonly type = ADD_GROUPS;
  constructor(public groups: any[]) {}
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}
export class Reset implements Action {
  readonly type = RESET;
}

export type All =
  | Query
  | AddAgents
  | AddSkills
  | AddGroups
  | Error
  | Reset;
