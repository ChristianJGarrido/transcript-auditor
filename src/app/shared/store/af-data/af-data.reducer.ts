import * as AfDataActions from './af-data.actions';
import { AfDataModel } from './af-data.model';

export type Action = AfDataActions.All;

const initialAfDataState: AfDataModel = {
  loading: false,
  error: true,
};

export function AfDataReducer(
  state: AfDataModel = initialAfDataState,
  action: Action
): AfDataModel {
  switch (action.type) {
    default:
      return state;
  }
}
