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

  // get ids associated with selected playlist
  @Effect()
  filter$: Observable<Action> = this.actions$
    .ofType(playlistActions.SELECT)
    .pipe(
      withLatestFrom(this.store.select(fromPlaylist.selectOne)),
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
      switchMap(async ([action, apiLogin, afLogin, conversationIds]) => {
        const uuid = this.afService.createUUID();
        const { name } = action;
        const playlist = {
          ...new Playlist(uuid, name, afLogin.email, afLogin.email, conversationIds),
        };
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          playlist.id
        );
        await ref.set(playlist);
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
      switchMap(async ([playlist, apiLogin, afLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          playlist.id
        );
        await ref.update({
            lastUpdateBy: afLogin.email,
            lastUpdateAt: new Date(),
            ...playlist.changes,
          });
        return new playlistActions.Success();
      }),
      catchError(err => [new playlistActions.Error(err)])
    );

  // delete
  @Effect()
  delete$: Observable<Action> = this.actions$
    .ofType(playlistActions.DELETE)
    .pipe(
      map((action: playlistActions.Delete) => action.id),
      withLatestFrom(this.store.select(state => state.apiLogin)),
      switchMap(async ([playlistId, apiLogin]) => {
        const ref = this.afService.getDocument(
          apiLogin.account,
          'playlists',
          playlistId
        );
        await ref.delete();
        return new playlistActions.Success();
      }),
      catchError(err => [new playlistActions.Error(err)])
    );

  constructor(
    private store: Store<StoreModel>,
    private actions$: Actions,
    private afService: FirestoreService
  ) {}
}
