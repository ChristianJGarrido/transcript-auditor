import { Action } from '@ngrx/store';
import { ConversationModel } from './conversation.model';

export const QUERY = '[Conversation] Query all';
export const QUERY_CONV = '[Conversation] Query by conversation ID';
export const SELECT = '[Conversation] Select';
export const FILTER_PLAYLIST = '[Conversation] Filter by playlist';

export const ADD_ALL = '[Conversation] Add all';
export const ADD_MANY = '[Conversation] Add many';
export const ADD_ONE = '[Conversation] Add one';
export const SUCCESS = '[Conversation] Success';
export const SUCCESS_SELECT = '[Conversation] Select success';
export const SUCCESS_ADD = '[Conversation] Add success';
export const ERROR = '[Conversation] Error';

export class Query implements Action {
  readonly type = QUERY;
  constructor(public options?: any) {}
}
export class QueryConv implements Action {
  readonly type = QUERY_CONV;
  constructor(public id: string) {}
}
export class Select implements Action {
  readonly type = SELECT;
  constructor(public id: string) {}
}
export class FilterPlaylist implements Action {
  readonly type = FILTER_PLAYLIST;
  constructor(public ids: any[]) {}
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public data: ConversationModel[]) {}
}
export class AddMany implements Action {
  readonly type = ADD_MANY;
  constructor(public data: ConversationModel[]) {}
}
export class AddOne implements Action {
  readonly type = ADD_ONE;
  constructor(public data: ConversationModel) {}
}

export class SuccessSelect implements Action {
  readonly type = SUCCESS_SELECT;
}
export class SuccessAdd implements Action {
  readonly type = SUCCESS_ADD;
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}

export type ConversationActions =
  | Query
  | QueryConv
  | Select
  | FilterPlaylist
  | AddAll
  | AddMany
  | AddOne
  | SuccessSelect
  | SuccessAdd
  | Error;
