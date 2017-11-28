import { Action } from '@ngrx/store';

export const GOOGLE_LOGIN = '[AfLogin] Google Login';
export const GET_USER = '[AfLogin] Get User';
export const AUTHENTICATED = '[AfLogin] Authenticated';
export const NOT_AUTHENTICATED = '[AfLogin] Not Authenticated';
export const LOGOUT = '[AfLogin] Logout';

export class GoogleLogin implements Action {
  readonly type = GOOGLE_LOGIN;
  constructor(public payload?: any) {}
}
export class GetUser implements Action {
  readonly type = GET_USER;
  constructor(public payload?: any) {}
}
export class Authenticated implements Action {
  readonly type = AUTHENTICATED;
  constructor(public payload?: any) {}
}
export class NotAuthenticated implements Action {
  readonly type = NOT_AUTHENTICATED;
  constructor(public payload?: any) {}
}
export class Logout implements Action {
  readonly type = LOGOUT;
  constructor(public payload?: any) {}
}

export type All = GoogleLogin | GetUser | Authenticated | NotAuthenticated | Logout;
