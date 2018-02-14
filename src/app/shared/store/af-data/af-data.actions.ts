import { Action } from '@ngrx/store';
import { AfLoginState } from '../af-login/af-login.model';

export const GET_DATA = '[DB Data] Get data';
export const SAVE_USER = '[DB Data] Save user';
export const SAVE_DATA = '[DB Data] Save data';

export class GetData implements Action {
  readonly type = GET_DATA;
  constructor(public user: AfLoginState) {}
}
export class SaveUser implements Action {
  readonly type = SAVE_USER;
  constructor(public user: any) {}
}
export class SaveData implements Action {
  readonly type = SAVE_DATA;
  constructor(public data: any) {}
}

export type All = GetData | SaveUser | SaveData;
