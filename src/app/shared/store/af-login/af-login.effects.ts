import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, exhaustMap } from 'rxjs/operators';

import * as AfLoginActions from './af-login.actions';
import { AfLoginState } from './af-login.model';

import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

export type Action = AfLoginActions.All;

@Injectable()
export class AfLoginEffects {
  @Effect()
  getUser$: Observable<Action> = this.actions$.ofType(AfLoginActions.GET_USER).pipe(
    map((action: AfLoginActions.GetUser) => action.payload),
    switchMap(payload => this.afAuth.authState),
    map(auth => {
      if (auth) {
        const user = new AfLoginState(auth.uid, auth.displayName, auth.email);
        return new AfLoginActions.Authenticated(user);
      } else {
        return new AfLoginActions.NotAuthenticated();
      }
    })
  );

  @Effect({ dispatch: false })
  authenticated$: Observable<Action> = this.actions$.ofType(AfLoginActions.AUTHENTICATED).pipe(
    switchMap(auth => {
      this.router.navigate(['/app']);
      return Observable.of(null);
    })
  );

  @Effect({ dispatch: false })
  notAuthenticated$: Observable<Action> = this.actions$.ofType(AfLoginActions.NOT_AUTHENTICATED).pipe(
    switchMap(auth => {
      this.router.navigate(['/login']);
      return Observable.of(null);
    })
  );

  @Effect()
  googleLogin$: Observable<Action> = this.actions$
    .ofType(AfLoginActions.GOOGLE_LOGIN)
    .pipe(
      map((action: AfLoginActions.GoogleLogin) => action.payload),
      switchMap(payload => Observable.fromPromise(this.googleLogin())),
      map(auth => new AfLoginActions.GetUser())
    );

  @Effect()
  logout$: Observable<Action> = this.actions$
    .ofType(AfLoginActions.LOGOUT)
    .pipe(
      map((action: AfLoginActions.Logout) => action.payload),
      switchMap(payload => Observable.fromPromise(this.logout())),
      map(auth => new AfLoginActions.GetUser())
    );

  constructor(private actions$: Actions, public afAuth: AngularFireAuth, private router: Router) {}

  googleLogin(): Promise<any> {
    return this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout(): Promise<any> {
    return this.afAuth.auth.signOut();
  }
}
