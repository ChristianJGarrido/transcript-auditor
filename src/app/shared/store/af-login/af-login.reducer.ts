import * as AfLoginActions from './af-login.actions';
import { AfLoginState, AfLoginModel } from './af-login.model';

export type Action = AfLoginActions.All;

const initialAfLoginState = new AfLoginState(null, 'GUEST', null);

export function AfLoginReducer(
  state: AfLoginState = initialAfLoginState,
  action: Action
): AfLoginModel {
  switch (action.type) {
    case AfLoginActions.GOOGLE_LOGIN:
      return {
        ...state,
        loading: true,
      };
    case AfLoginActions.GET_USER:
      return {
        ...state,
        loading: true,
      };
    case AfLoginActions.AUTHENTICATED:
      return {
        ...state,
        ...action.user,
        loading: false,
      };
    case AfLoginActions.NOT_AUTHENTICATED:
      return {
        ...state,
        ...initialAfLoginState,
        loading: false,
      };
    case AfLoginActions.LOGOUT:
      return {
        ...state,
        loading: true,
      };
    case AfLoginActions.SUCCESS:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
}
