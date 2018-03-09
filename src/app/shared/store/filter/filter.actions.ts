import { Action } from '@ngrx/store';
import { FilterModel } from './filter.model';

export const TOGGLE_CONVERSATION_TYPES = '[Filter] Toggle conversation types';
export const TOGGLE_ID_TYPE = '[Filter] Toggle ID type';
export const TOGGLE_SEARCH_BY = '[Filter] Toggle search by ID';
export const ERROR = '[Filter] Error';
export const RESET = '[Filter] Reset';

export class ToggleConversationTypes implements Action {
  readonly type = TOGGLE_CONVERSATION_TYPES;
  constructor(public types: string[]) {}
}
export class ToggleSearchById implements Action {
  readonly type = TOGGLE_SEARCH_BY;
  constructor(public searchById: boolean) {}
}
export class ToggleIdType implements Action {
  readonly type = TOGGLE_ID_TYPE;
  constructor(public idTypes: string[]) {}
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}
export class Reset implements Action {
  readonly type = RESET;
}

export type All =
  | ToggleConversationTypes
  | ToggleIdType
  | ToggleSearchById
  | Error
  | Reset;
