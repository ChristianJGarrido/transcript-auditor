import * as ApiDataActions from './api-data.actions';
import { ApiDataModel } from './api-data.model';

export type Action = ApiDataActions.All;

const initialApiDataState: ApiDataModel = {
  engHist: {
    _metadata: null,
    interactionHistoryRecords: [],
  },
  msgHist: {
    _metadata: null,
    conversationHistoryRecords: [],
  },
  total: [],
  select: null,
  error: false,
  loading: false,
};

export function ApiDataReducer(
  state: ApiDataModel = initialApiDataState,
  action: Action
): ApiDataModel {
  switch (action.type) {
    case ApiDataActions.GET_CONVERSATIONS:
      return {
        ...state,
        error: false,
        loading: true,
      };
    case ApiDataActions.SAVE_CONVERSATIONS:
      return {
        ...state,
        ...action.data,
        loading: false,
      };
    case ApiDataActions.SELECT_CONVERSATION:
      return {
        ...state,
        select: action.select,
      };
    case ApiDataActions.DATA_ERROR:
      return {
        ...state,
        error: true,
        loading: false,
      };
    default:
      return state;
  }
}
