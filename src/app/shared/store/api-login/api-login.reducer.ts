import * as ApiLoginActions from './api-login.actions';
import { ApiLoginState, ApiLoginModel } from './api-login.model';

export type Action = ApiLoginActions.All;

const initialApiLoginState = new ApiLoginState(null, '', '', false, {
  agentVep: '',
  engHist: '',
  msgHist: '',
});

export function ApiLoginReducer(
  state: ApiLoginModel = initialApiLoginState,
  action: Action
): ApiLoginModel {
  switch (action.type) {
    case ApiLoginActions.GET_DOMAINS:
    case ApiLoginActions.LOGIN:
    case ApiLoginActions.SAVE_SESSION:
    case ApiLoginActions.GET_SESSION:
      return {
        ...state,
        error: false,
        loading: true,
      };
    case ApiLoginActions.AUTHENTICATED:
      return {
        ...state,
        ...action.session,
        loading: false,
      };
    case ApiLoginActions.NOT_AUTHENTICATED:
      return {
        ...state,
        ...initialApiLoginState,
        loading: false,
      };
    case ApiLoginActions.LOGIN_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      };
    default:
      return state;
  }
}
