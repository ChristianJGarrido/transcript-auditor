import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import {
  switchMap,
  mergeMap,
  map,
  withLatestFrom,
  catchError,
  debounceTime,
  distinctUntilChanged,
} from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';
import { StoreModel } from '../../../app.store';
import { ConversationModel } from './conversation.model';
import * as conversationActions from './conversation.actions';
import * as fromConversation from './conversation.reducer';

@Injectable()
export class ConversationEffects {
  // query collection
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType(conversationActions.QUERY)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {

        return [];
      }),
      map(data => new conversationActions.AddAll(data)),
      catchError(err => [new conversationActions.Error(err)])
    );

  // select after add
  @Effect({ dispatch: false })
  select$: Observable<Action> = this.actions$
    .ofType(conversationActions.ADD_ALL)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectConversation),
        this.store.select(fromConversation.selectIds)
      ),
      map(([action, data, ids]) => {
        if (!data) {
          const index = 0;
          const id = ids[index];
          this.store.dispatch(new conversationActions.Select(id.toString()));
        }
        return null;
      })
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
  ) {}
}
