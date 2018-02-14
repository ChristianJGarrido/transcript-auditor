import { Action } from '@ngrx/store';
import { ApiMsgHist } from './api-data.model';

export const GET_DATA = '[API Data] Get data';
export const SAVE_DATA = '[API Data] Save data';
export const SELECT_CONVERSATION = '[API Data] Select conversation';
export const DATA_ERROR = '[API Data] Error getting data';

export class GetData implements Action {
  readonly type = GET_DATA;
}
export class SaveData implements Action {
  readonly type = SAVE_DATA;
  constructor(public data: ApiMsgHist) {}
}
export class SelectConversation implements Action {
  readonly type = SELECT_CONVERSATION;
  constructor(public select: any) {}
}
export class DataError implements Action {
  readonly type = DATA_ERROR;
  constructor(public error: any) {}
}

export type All = GetData | SaveData | SelectConversation | DataError;
