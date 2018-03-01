import { Action } from '@ngrx/store';
import { AfLoginState } from './af-login.model';

export const GOOGLE_LOGIN = '[DB Login] Google login';
export const GET_USER = '[DB Login] Get user';
export const CREATE_USER = '[DB Login] Create user';
export const AUTHENTICATED = '[DB Login] Authenticated';
export const NOT_AUTHENTICATED = '[DB Login] Not authenticated';
export const LOGOUT = '[DB Login] Logout';

export const SUCCESS = '[DB Login] Success';
export const ERROR = '[DB Login] Error';

export class GoogleLogin implements Action {
  readonly type = GOOGLE_LOGIN;
}
export class GetUser implements Action {
  readonly type = GET_USER;
}
export class CreateUser implements Action {
  readonly type = CREATE_USER;
  constructor(public user: AfLoginState) {}
}
export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public user: AfLoginState, public navigate: boolean) {}
}
export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
}
export class Logout implements Action {
  readonly type = LOGOUT;
}
export class Success implements Action {
  readonly type = SUCCESS;
}
export class Error implements Action {
  readonly type = ERROR;
  constructor(public error: any) {}
}

export type All =
  | GoogleLogin
  | GetUser
  | CreateUser
  | Authenticated
  | NotAuthenticated
  | Logout
  | Success
  | Error;
