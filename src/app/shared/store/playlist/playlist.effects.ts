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
import { Playlist, PlaylistModel } from './playlist.model';
import * as playlistActions from './playlist.actions';
import * as fromPlaylist from './playlist.reducer';

@Injectable()
export class PlaylistEffects {
  // query collection
  @Effect()
  query$: Observable<Action> = this.actions$.ofType(playlistActions.QUERY).pipe(
    withLatestFrom(this.store.select(state => state.apiLogin)),
    switchMap(([action, apiLogin]) => {
      const ref = this.afService.getPlaylists(apiLogin.account);
      return ref.valueChanges();
    }),
    map(data => new playlistActions.AddAll(data)),
    catchError(err => [new playlistActions.Error(err)])
  );

  // select after add
  @Effect({ dispatch: false })
  select$: Observable<Action> = this.actions$
    .ofType(playlistActions.ADD_ALL)
    .pipe(
      withLatestFrom(
        this.store.select(fromPlaylist.selectPlaylist),
        this.store.select(fromPlaylist.selectIds)
      ),
      map(([action, data, ids]) => {
        if (!data) {
          const index = 0;
          const id = ids[index];
          return new playlistActions.Select(id);
        }
        return new playlistActions.Success();
      })
    );

  // create
  @Effect()
  create$: Observable<Action> = this.actions$
    .ofType(playlistActions.CREATE)
    .pipe(
      map((action: playlistActions.Create) => action),
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(state => state.afLogin)
      ),
      switchMap(([action, apiLogin, afLogin]) => {
        const uuid = this.afService.createUUID();
        const data = {
          ...new Playlist(uuid, afLogin.email, afLogin.email),
        };
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          data.id
        );
        return Observable.fromPromise(ref.set(data));
      }),
      map(() => new playlistActions.Success()),
      catchError(err => [new playlistActions.Error(err)])
    );

  // update
  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(playlistActions.UPDATE)
    .pipe(
      map((action: playlistActions.Update) => action),
      withLatestFrom(this.store.select(state => state.apiLogin)),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(([data, apiLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          data.id
        );
        return Observable.fromPromise(ref.update(data.changes));
      }),
      map(() => new playlistActions.Success()),
      catchError(err => [new playlistActions.Error(err)])
    );

  // delete
  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(playlistActions.DELETE)
    .pipe(
      map((action: playlistActions.Delete) => action.id),
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(([id, apiLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          id
        );
        return Observable.fromPromise(ref.delete());
      }),
      map(() => new playlistActions.Success()),
      catchError(err => [new playlistActions.Error(err)])
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
    private afService: FirestoreService
  ) {}
}
