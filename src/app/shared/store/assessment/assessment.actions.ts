import { Action } from '@ngrx/store';
import { AssessmentModel } from './assessment.model';

export const QUERY = '[Assessment] Query';
export const SELECT = '[Assessment] Select';

export const CREATE = '[Assessment] Create';
export const UPDATE = '[Assessment] Update';
export const DELETE = '[Assessment] Delete';

export const ADD_ALL = '[Assessment] Add all';
export const SUCCESS = '[Assessment] Success';
export const ERROR = '[Assessment] Error';

export class Query implements Action {
  readonly type = QUERY;
}
export class Select implements Action {
  readonly type = SELECT;
  constructor(public id: string) {}
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public data: AssessmentModel[]) {}
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
    public changes: Partial<AssessmentModel>
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
