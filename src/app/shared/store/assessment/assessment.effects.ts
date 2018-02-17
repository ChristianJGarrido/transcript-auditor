import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { switchMap, mergeMap, map, withLatestFrom, catchError } from 'rxjs/operators';
import { Action, Store } from '@ngrx/store';
import { Actions, Effect } from '@ngrx/effects';

import { StoreModel } from '../../../app.store';
import { Assessment, AssessmentModel } from './assessment.model';
import * as assessmentActions from './assessment.actions';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
} from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AssessmentEffects {

  // query collection
  @Effect()
  query$: Observable<Action> = this.actions$
    .ofType(assessmentActions.QUERY)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([action, apiLogin]) => {
        const ref = this.getAssessments(apiLogin.account);
        return ref.snapshotChanges().map(arr => {
          return arr.map(doc => {
            const data = doc.payload.doc.data();
            return { id: doc.payload.doc.id, ...data } as AssessmentModel;
          });
        });
      }),
      map(assessments => new assessmentActions.AddAll(assessments)),
      catchError(err => [new assessmentActions.Error(err)]),
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
      switchMap(([action, apiLogin, afLogin]) => {
        const assessment = {
          ...new Assessment(afLogin.email, this.createUUID()),
        };
        const ref = this.getAssessment(apiLogin.account, assessment.id);
        return Observable.fromPromise(ref.set(assessment));
      }),
      map(() => new assessmentActions.Success()),
      catchError(err => [new assessmentActions.Error(err)]),
    );

  // update
  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(assessmentActions.UPDATE)
    .pipe(
      map((action: assessmentActions.Update) => action),
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([assessment, apiLogin]) => {
        const ref = this.getAssessment(apiLogin.account, assessment.id);
        return Observable.fromPromise(ref.update(assessment.changes));
      }),
      map(() => new assessmentActions.Success()),
      catchError(err => [new assessmentActions.Error(err)]),
    );

  // delete
  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(assessmentActions.DELETE)
    .pipe(
      map((action: assessmentActions.Delete) => action.id),
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([id, apiLogin]) => {
        const ref = this.getAssessment(apiLogin.account, id);
        return Observable.fromPromise(ref.delete());
      }),
      map(() => new assessmentActions.Success()),
      catchError(err => [new assessmentActions.Error(err)]),
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore
  ) {}

  /**
   * returns assessment collection
   * @param {string} account
   */
  getAssessments(account: string): AngularFirestoreCollection<{}> {
    return this.afStore
      .doc(`accounts/${account}`)
      .collection<AssessmentModel>('assessments');
  }

  /**
   * returns assessment document
   * @param {string} account
   * @param {string} id
   */
  getAssessment(account: string, id: string): AngularFirestoreDocument<{}> {
    return this.getAssessments(account).doc(id);
  }

  /* tslint:disable:no-bitwise */
  createUUID() {
    let dt = new Date().getUTCMilliseconds();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = ((dt + Math.random() * 16) % 16) | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
    return uuid;
  }
}
