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
import * as fromAssessment from './assessment.reducer';

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
  @Effect({ dispatch: false })
  select$: Observable<Action> = this.actions$
    .ofType(assessmentActions.ADD_ALL)
    .pipe(
      withLatestFrom(
        this.store.select(fromAssessment.selectOne),
        this.store.select(fromAssessment.selectIds)
      ),
      map(([action, data, ids]) => {
        if (!data && ids.length) {
          const index = 0;
          const id = ids[index];
          this.store.dispatch(new assessmentActions.Select(id && id.toString()));
        }
        return null;
      })
    );

  // create
  @Effect()
  create$: Observable<Action> = this.actions$
    .ofType(assessmentActions.CREATE)
    .pipe(
      map((action: assessmentActions.Create) => action),
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(state => state.afLogin)
      ),
      switchMap(async ([action, apiLogin, afLogin]) => {
        const uuid = this.afService.createUUID();
        const data = {
          ...new Assessment(uuid, afLogin.email, afLogin.email, '123'),
        };
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          data.id
        );
        await ref.set(data);
        return new assessmentActions.Select(uuid);
      }),
      catchError(err => [new assessmentActions.Error(err)])
    );

  // update
  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(assessmentActions.UPDATE)
    .pipe(
      map((action: assessmentActions.Update) => action),
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(state => state.afLogin)
      ),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(([data, apiLogin, afLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          data.id
        );
        return Observable.fromPromise(
          ref.update({
            lastUpdateBy: afLogin.email,
            lastUpdateAt: new Date(),
            ...data.changes,
          })
        );
      }),
      map(() => new assessmentActions.Success()),
      catchError(err => [new assessmentActions.Error(err)])
    );

  // delete
  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(assessmentActions.DELETE)
    .pipe(
      map((action: assessmentActions.Delete) => action.id),
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([id, apiLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          id
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
