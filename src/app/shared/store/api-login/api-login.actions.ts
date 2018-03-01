import { Action } from '@ngrx/store';
import { ApiLoginState, ApiLoginUser, ApiDomains } from './api-login.model';

export const GET_DOMAINS = '[API Login] Get domains';
export const LOGIN = '[API Login] Login';
export const GET_SESSION = '[API Login] Get session';
export const SAVE_SESSION = '[API Login] Save session';
export const AUTHENTICATED = '[API Login] Authenticated';
export const NOT_AUTHENTICATED = '[API Login] Not authenticated';
export const LOGIN_ERROR = '[API Login] Login error';

export class GetDomains implements Action {
  readonly type = GET_DOMAINS;
}
export class Login implements Action {
  readonly type = LOGIN;
  constructor(public user: ApiLoginUser, public domains: ApiDomains) {}
}
export class GetSession implements Action {
  readonly type = GET_SESSION;
}
export class SaveSession implements Action {
  readonly type = SAVE_SESSION;
  constructor(public session: ApiLoginState) {}
}
export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public session: ApiLoginState) {}
}
export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
  constructor(public dialog: boolean) {}
}
export class LoginError implements Action {
  readonly type = LOGIN_ERROR;
  constructor(public error: any) {}
}

export type All = GetDomains | Login | GetSession | SaveSession | NotAuthenticated | Authenticated | LoginError;
