import { Action } from '@ngrx/store';
import { AfLoginState } from '../af-login/af-login.model';

export const GET_USER = '[DB Data] Get user';
export const CREATE_DOCUMENT = '[DB Data] Create document';
export const UPDATE_DOCUMENT = '[DB Data] Update document';
export const SELECT_DOCUMENT = '[DB Data] Select document';
export const SUCCESS = '[DB Data] Success';
export const ERROR = '[DB Data] Error';
export const GET_COLLECTIONS = '[DB Data] Get collections';
export const SAVE_COLLECTIONS = '[DB Data] Save collections';
export const SAVE_USER = '[DB Data] Save user';

export class GetUser implements Action {
  readonly type = GET_USER;
  constructor(public user: AfLoginState) {}
}
export class UpdateDocument implements Action {
  readonly type = UPDATE_DOCUMENT;
  constructor(public collection: string, public id: string) {}
}
export class CreateDocument implements Action {
  readonly type = CREATE_DOCUMENT;
  constructor(public collection: string) {}
}
export class SelectDocument implements Action {
  readonly type = SELECT_DOCUMENT;
  constructor(public collection: string, public selected: any[]) {}
}
export class GetCollections implements Action {
  readonly type = GET_COLLECTIONS;
  constructor(public collections: string[]) {}
}
export class SaveCollections implements Action {
  readonly type = SAVE_COLLECTIONS;
  constructor(public collections: any) {}
}
export class SaveUser implements Action {
  readonly type = SAVE_USER;
  constructor(public user: any) {}
}
export class Success implements Action {
  readonly type = SUCCESS;
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}

export type All =
  | GetUser
  | SaveUser
  | UpdateDocument
  | CreateDocument
  | SelectDocument
  | GetCollections
  | SaveCollections
  | Error
  | Success;
