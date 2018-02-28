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
import { FirestoreService } from '../../services/firestore.service';
import { StoreModel } from '../../../app.store';
import { Assessment, AssessmentModel } from './assessment.model';
import * as assessmentActions from './assessment.actions';
import * as conversationActions from '../conversation/conversation.actions';
import * as fromAssessment from './assessment.reducer';
import * as fromConversation from '../conversation/conversation.reducer';

@Injectable()
export class AssessmentEffects {
  // query collection
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType(assessmentActions.QUERY)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {
        const ref = this.afService.getAssessments(apiLogin.account);
        return ref.valueChanges();
      }),
      map(data => new assessmentActions.AddAll(data)),
      catchError(err => [new assessmentActions.Error(err)])
    );

  // select after add
  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(assessmentActions.ADD_ALL, conversationActions.SELECT)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectId),
        this.store.select(fromAssessment.selectOne),
        this.store.select(fromAssessment.selectAll)
      ),
      switchMap(([action, conversationId, assessmentSelect, assessments]) => {
        // filter by conversation id
        let select = [];
        if (conversationId) {
          const filtered: string[] = assessments.reduce((prev, curr) => {
            if (curr.conversationId === conversationId) {
              return [...prev, curr.id];
            }
            return prev;
          }, []);
          // select assessment if none selected
          if (!assessmentSelect && filtered.length) {
            const index = 0;
            const id = filtered[index];
            select = [new assessmentActions.Select(id && id.toString())];
          } else if (!filtered.length) {
            select = [new assessmentActions.Select('')];
          }
          return [new assessmentActions.FilterConversation(filtered), ...select];
        }
        return [new assessmentActions.FilterConversation([]), ...select];
      })
    );

  // create
  @Effect()
  create$: Observable<Action> = this.actions$
    .ofType<assessmentActions.Create>(assessmentActions.CREATE)
    .pipe(
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(state => state.afLogin),
        this.store.select(fromConversation.selectId)
      ),
      switchMap(async ([action, apiLogin, afLogin, conversationId]) => {
        if (conversationId) {
          const uuid = this.afService.createUUID();
          const data = {
            ...new Assessment(uuid, afLogin.email, afLogin.email, conversationId),
          };
          const ref = this.afService.getDocument(
            apiLogin.account,
            'assessments',
            data.id
          );
          await ref.set(data);
          return new assessmentActions.Select(uuid);
        }
        return new assessmentActions.Select(null);
      }),
      catchError(err => [new assessmentActions.Error(err)])
    );

  // update
  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType<assessmentActions.Update>(assessmentActions.UPDATE)
    .pipe(
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(state => state.afLogin)
      ),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(([action, apiLogin, afLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          action.id
        );
        return Observable.fromPromise(
          ref.update({
            lastUpdateBy: afLogin.email,
            lastUpdateAt: new Date(),
            ...action.changes,
          })
        );
      }),
      map(() => new assessmentActions.Success()),
      catchError(err => [new assessmentActions.Error(err)])
    );

  // delete
  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType<assessmentActions.Delete>(assessmentActions.DELETE)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          action.id
        );
        return Observable.fromPromise(ref.delete());
      }),
      map(() => new assessmentActions.Success()),
      catchError(err => [new assessmentActions.Error(err)])
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
    private afService: FirestoreService
  ) {}
}
