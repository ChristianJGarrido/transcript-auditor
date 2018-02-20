import { Action } from '@ngrx/store';
import { PlaylistModel } from './playlist.model';

export const QUERY = '[Playlist] Query';
export const SELECT = '[Playlist] Select';

export const CREATE = '[Playlist] Create';
export const UPDATE = '[Playlist] Update';
export const DELETE = '[Playlist] Delete';

export const ADD_ALL = '[Playlist] Add all';
export const SUCCESS = '[Playlist] Success';
export const ERROR = '[Playlist] Error';

export class Query implements Action {
  readonly type = QUERY;
}
export class Select implements Action {
  readonly type = SELECT;
  constructor(public id: string) {}
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public data: PlaylistModel[]) {}
}
export class Success implements Action {
  readonly type = SUCCESS;
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}

export class Create implements Action {
  readonly type = CREATE;
}
export class Delete implements Action {
  readonly type = DELETE;
  constructor(public id: string) {}
}
export class Update implements Action {
  readonly type = UPDATE;
  constructor(
    public id: string,
    public changes: Partial<PlaylistModel>
  ) {}
}

export type AssessmentActions =
  | Query
  | Select
  | Create
  | Update
  | Delete
  | AddAll
  | Success
  | Error;
