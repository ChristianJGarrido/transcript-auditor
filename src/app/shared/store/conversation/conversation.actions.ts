import { Action } from '@ngrx/store';
import { ConversationModel } from './conversation.model';

export const QUERY = '[Conversation] Query';
export const SELECT = '[Conversation] Select';
export const FILTER_PLAYLIST = '[Conversation] Filter by playlist';

export const ADD_ALL = '[Conversation] Add all';
export const SUCCESS = '[Conversation] Success';
export const ERROR = '[Conversation] Error';

export class Query implements Action {
  readonly type = QUERY;
}
export class Select implements Action {
  readonly type = SELECT;
  constructor(public id: string) {}
}
export class FilterPlaylist implements Action {
  readonly type = FILTER_PLAYLIST;
  constructor(public ids: string[]) {}
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public data: ConversationModel[]) {}
}
export class Success implements Action {
  readonly type = SUCCESS;
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}

export type ConversationActions =
  | Query
  | Select
  | FilterPlaylist
  | AddAll
  | Success
  | Error;
