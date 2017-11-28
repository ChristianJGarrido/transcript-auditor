import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// store
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import * as AfLoginActions from '../store/af-login/af-login.actions';
import { AfLoginState } from '../store/af-login/af-login.model';

// 3rd party
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AfAuthGuardService implements CanActivate {
  constructor(public afAuth: AngularFireAuth, private router: Router, private store: Store<StoreModel>) {}

  // return login status: true / false
  canActivate() {
    return this.afAuth.authState.map(auth => {
      if (auth) {
        const user = new AfLoginState(auth.uid, auth.displayName, auth.email);
        this.store.dispatch(new AfLoginActions.Authenticated(user));
        return true;
      } else {
        this.store.dispatch(new AfLoginActions.NotAuthenticated());
        return false;
      }
    });
  }
}
