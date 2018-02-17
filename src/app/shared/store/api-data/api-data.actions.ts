import { Action } from '@ngrx/store';
import { ApiMsgHist, ApiEngHist } from './api-data.model';

export const GET_CONVERSATIONS = '[API Data] Get conversations';
export const SAVE_CONVERSATIONS = '[API Data] Save conversations';
export const SELECT_CONVERSATION = '[API Data] Select conversation';
export const DATA_ERROR = '[API Data] Error getting data';

export class GetConversations implements Action {
  readonly type = GET_CONVERSATIONS;
}
export class SaveConversations implements Action {
  readonly type = SAVE_CONVERSATIONS;
  constructor(public data: { msgHist: ApiMsgHist; engHist: ApiEngHist }) {}
}
export class SelectConversation implements Action {
  readonly type = SELECT_CONVERSATION;
  constructor(public select: any) {}
}
export class DataError implements Action {
  readonly type = DATA_ERROR;
  constructor(public error: any) {}
}

export type All =
  | GetConversations
  | SaveConversations
  | SelectConversation
  | DataError;
