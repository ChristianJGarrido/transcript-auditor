import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
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
import * as playlistActions from '../playlist/playlist.actions';
import * as fromAssessment from './assessment.reducer';
import * as fromConversation from '../conversation/conversation.reducer';
import * as fromPlaylist from '../playlist/playlist.reducer';

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
  // TODO REFACTOR - SLOW
  // TODO REFACTOR - SLOW
  // TODO REFACTOR - SLOW
  @Effect()
  select$: Observable<Action> = this.actions$
    .ofType(assessmentActions.ADD_ALL, conversationActions.SELECT)
    .pipe(
      withLatestFrom(
        this.store.select(fromConversation.selectId),
        this.store.select(fromConversation.selectAll),
        this.store.select(fromAssessment.selectOne),
        this.store.select(fromAssessment.selectAll),
        this.store.select(fromPlaylist.selectOne)
      ),
      switchMap(
        ([
          action,
          conversationId,
          conversations,
          assessmentSelect,
          assessments,
          playlist,
        ]) => {
          // filter by conversation id
          const idsByConversation = conversationId
            ? this.filterById(assessments, conversationId)
            : [];
          // filter by playlist ids
          const idsByPlaylist = playlist
            ? this.filterById(assessments, playlist.conversationIds)
            : [];
          // prepare filter action
          const filterAction = new assessmentActions.Filter(
            idsByConversation,
            idsByPlaylist
          );
          // select assessment if none selected
          const convId = assessmentSelect && assessmentSelect.conversationId;
          const match = conversationId === convId;
          const id =
            idsByConversation.length && !match ? idsByConversation[0] : null;
          const select = !match ? [new assessmentActions.Select(id)] : [];
          return [filterAction, ...select];
        }
      )
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
            ...new Assessment(
              uuid,
              afLogin.displayName,
              afLogin.displayName,
              conversationId
            ),
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
      switchMap(async ([action, apiLogin, afLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          action.id
        );
        await ref.update({
          lastUpdateBy: afLogin.displayName,
          lastUpdateAt: new Date(),
          ...action.changes,
        });
        return new assessmentActions.Success();
      }),
      catchError(err => [new assessmentActions.Error(err)])
    );

  // delete
  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType<assessmentActions.Delete>(assessmentActions.DELETE)
    .pipe(
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(async ([action, apiLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'assessments',
          action.id
        );
        await ref.delete();
        return new assessmentActions.Success();
      }),
      catchError(err => [new assessmentActions.Error(err)])
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
    private afService: FirestoreService
  ) {}

  filterById(assessments: any[], id: string | string[]): string[] {
    return assessments.reduce((prev, curr) => {
      return id.includes(curr.conversationId) ? [...prev, curr.id] : prev;
    }, []);
  }
}
