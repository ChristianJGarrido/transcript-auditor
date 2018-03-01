import { environment } from '../environments/environment';

// reducers
import { AfLoginReducer } from './shared/store/af-login/af-login.reducer';
import { ApiLoginReducer } from './shared/store/api-login/api-login.reducer';
import { AssessmentReducer } from './shared/store/assessment/assessment.reducer';
import { PlaylistReducer } from './shared/store/playlist/playlist.reducer';
import { ConversationReducer } from './shared/store/conversation/conversation.reducer';
import { StatsReducer } from './shared/store/stats/stats.reducer';

// models
import { AfLoginModel } from './shared/store/af-login/af-login.model';
import { ApiLoginModel } from './shared/store/api-login/api-login.model';
import { AssessmentModel } from './shared/store/assessment/assessment.model';
import { PlaylistModel } from './shared/store/playlist/playlist.model';
import { ConversationModel } from './shared/store/conversation/conversation.model';
import { StatsModel } from './shared/store/stats/stats.model';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import {
  combineReducers,
  ActionReducer,
  ActionReducerMap,
  Action,
} from '@ngrx/store';

/**
 * storeLogger provides a more advanced logging middleware for
 * store state changes. Lists the previous and next state following any
 * action given.
 */
import { storeLogger } from 'ngrx-store-logger';

// store modal
export interface StoreModel {
  afLogin: AfLoginModel;
  apiLogin: ApiLoginModel;
  assessment: AssessmentModel;
  playlist: PlaylistModel;
  conversation: ConversationModel;
  stats: StatsModel;
}

// store reducers
export const reducers: ActionReducerMap<any> = {
  afLogin: AfLoginReducer,
  apiLogin: ApiLoginReducer,
  assessment: AssessmentReducer,
  playlist: PlaylistReducer,
  conversation: ConversationReducer,
  stats: StatsReducer,
};

// declare metaReducers
export function logger(
  reducer: ActionReducer<StoreModel>
): ActionReducer<StoreModel> {
  return storeLogger({ collapsed: true })(reducer);
}

// export metaReducers
export const metaReducers = environment.production ? [] : [logger];
