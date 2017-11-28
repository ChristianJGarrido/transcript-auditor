import { environment } from '../environments/environment';

// reducers
import { AfLoginReducer } from './shared/store/af-login/af-login.reducer';

// models
import { AfLoginModel } from './shared/store/af-login/af-login.model';

/**
 * combineReducers is another useful metareducer that takes a map of reducer
 * functions and creates a new reducer that stores the gathers the values
 * of each reducer and stores them using the reducer's key. Think of it
 * almost like a database, where every reducer is a table in the db.
 *
 * More: https://egghead.io/lessons/javascript-redux-implementing-combinereducers-from-scratch
 */
import { combineReducers, ActionReducer, ActionReducerMap, Action } from '@ngrx/store';

/**
 * storeLogger provides a more advanced logging middleware for
 * store state changes. Lists the previous and next state following any
 * action given.
 */
import { storeLogger } from 'ngrx-store-logger';

// store modal
export interface StoreModel {
  afLogin: AfLoginModel;
}

// store reducers
export const reducers: ActionReducerMap<StoreModel> = {
  afLogin: AfLoginReducer
};

// declare metaReducers
export function logger(reducer: ActionReducer<StoreModel>): ActionReducer<StoreModel> {
  return storeLogger({ collapsed: true })(reducer);
}

// export metaReducers
export const metaReducers = environment.production ? [] : [logger];
