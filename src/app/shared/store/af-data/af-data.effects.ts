import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Effect, Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { map, switchMap, exhaustMap, first } from 'rxjs/operators';

import * as AfLoginActions from '../af-login/af-login.actions';
import { AfLoginState } from '../af-login/af-login.model';
import * as AfDataActions from '../af-data/af-data.actions';
import { AfDataModel } from '../af-data/af-data.model';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class AfDataEffects {
  @Effect()
  getAfUser$: Observable<any> = this.actions$
    .ofType<AfDataActions.GetData>(AfDataActions.GET_DATA)
    .pipe(
      switchMap(action => {
        const { uid, email, displayName } = action.user;
        const docRef = this.afStore.doc(`users/${uid}`);
        return docRef.valueChanges().pipe(
          first(),
          map(user => {
            if (user) {
              return new AfDataActions.SaveUser(user);
            }
            const newUser = {
              email,
              displayName,
              createdAt: new Date(),
            };
            docRef.set(newUser);
            return new AfDataActions.SaveUser(newUser);
          })
        );
      })
    );

  @Effect()
  getAfData$: Observable<any> = this.actions$
    .ofType()
    .pipe(
      map(test => {
        // this.afStore.doc(`accounts/${account}`).collection('conversations');
        return { type: 'GOT DATA AFTER AUTH' };
      })
    );

  constructor(
    private actions$: Actions,
    public afAuth: AngularFireAuth,
    public afStore: AngularFirestore,
    private router: Router
  ) {}
}
