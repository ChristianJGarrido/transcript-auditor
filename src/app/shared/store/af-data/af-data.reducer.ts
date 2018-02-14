import * as AfDataActions from './af-data.actions';
import { AfDataModel } from './af-data.model';

export type Action = AfDataActions.All;

const initialAfDataState: AfDataModel = {
  data: null,
  user: null,
  loading: false,
};

export function AfDataReducer(
  state: AfDataModel = initialAfDataState,
  action: Action
): AfDataModel {
  switch (action.type) {
    case AfDataActions.GET_DATA:
      return {
        ...state,
        loading: true,
      };
    case AfDataActions.SAVE_USER:
      return {
        ...state,
        user: action.user,
        loading: false,
      };
    case AfDataActions.SAVE_DATA:
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    default:
      return state;
  }
}
