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
import * as conversationActions from '../conversation/conversation.actions';
import * as fromPlaylist from './playlist.reducer';
import * as fromConversation from '../conversation/conversation.reducer';

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
  add$: Observable<Action> = this.actions$
    .ofType(playlistActions.ADD_ALL)
    .pipe(
      withLatestFrom(
        this.store.select(fromPlaylist.selectOne),
        this.store.select(fromPlaylist.selectIds)
      ),
      map(([action, data, ids]) => {
        if (!data && ids.length) {
          const index = 0;
          const id = ids[index];
          return new playlistActions.Select(id && id.toString());
        }
        return new playlistActions.Success();
      })
    );

   // select ids
   @Effect()
   select$: Observable<Action> = this.actions$
     .ofType(playlistActions.SELECT)
     .pipe(
       withLatestFrom(
         this.store.select(fromPlaylist.selectOne),
        //  this.store.select(fromConversation.selectIds),
        ),
       map(([action, playlist]) => {
          if (playlist) {
            const ids = playlist.conversationIds;
            return new conversationActions.FilterPlaylist(ids);
          }
          return new conversationActions.FilterPlaylist([]);
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
        this.store.select(state => state.afLogin),
        this.store.select(fromConversation.selectPlaylistIds)
      ),
      switchMap(async ([action, apiLogin, afLogin, ids]) => {
        const uuid = this.afService.createUUID();
        const { name } = action;
        const data = {
          ...new Playlist(uuid, name, afLogin.email, afLogin.email, ids),
        };
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          data.id
        );
        await ref.set(data);
        return new playlistActions.Select(uuid);
      }),
      catchError(err => [new playlistActions.Error(err)])
    );

  // update
  @Effect()
  update$: Observable<Action> = this.actions$
    .ofType(playlistActions.UPDATE)
    .pipe(
      map((action: playlistActions.Update) => action),
      withLatestFrom(
        this.store.select(state => state.apiLogin),
        this.store.select(state => state.afLogin)
      ),
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(([data, apiLogin, afLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
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
