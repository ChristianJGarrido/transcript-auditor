import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  mergeMap,
  map,
  withLatestFrom,
  catchError,
} from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { StoreModel } from '../../../app.store';
import * as filterActions from './filter.actions';
import * as conversationActions from '../conversation/conversation.actions';
import { FilterModel } from './filter.model';

@Injectable()
export class FilterEffects {
  // filter types
  @Effect()
  filterTypes$: Observable<Action> = this.actions$
    .ofType(filterActions.TOGGLE_CONVERSATION_TYPES)
    .pipe(
      map(() => new conversationActions.Query('all'))
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions
  ) {}
}
