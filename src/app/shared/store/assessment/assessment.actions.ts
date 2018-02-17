import { Action } from '@ngrx/store';
import { AssessmentModel } from './assessment.model';

export const QUERY = '[Assessment] Query assessments';

export const CREATE = '[Assessment] Create';
export const UPDATE = '[Assessment] Update';
export const DELETE = '[Assessment] Delete';

export const ADD_ALL = '[Assessment] Add all';
export const SUCCESS = '[Assessment] Successful firestore write';
export const ERROR = '[Assessment] Firestore error';

export class Query implements Action {
  readonly type = QUERY;
}

export class AddAll implements Action {
  readonly type = ADD_ALL;
  constructor(public assessments: AssessmentModel[]) {}
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
  constructor(public id: string, public changes: Partial<AssessmentModel>) {}
}

export type AssessmentActions =
  | Query
  | Create
  | Update
  | Delete
  | AddAll
  | Success
  | Error;
