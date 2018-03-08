import { Action } from '@ngrx/store';
import { FilterModel } from './filter.model';

export const TOGGLE_TYPES = '[Filter] Toggle types';
export const ERROR = '[Filter] Error';
export const RESET = '[Filter] Reset';

export class ToggleTypes implements Action {
  readonly type = TOGGLE_TYPES;
  constructor(public types: any[]) {}
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}
export class Reset implements Action {
  readonly type = RESET;
}

export type All =
  | ToggleTypes
  | Error
  | Reset;
