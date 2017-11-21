import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

// 3rd party
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Injectable()
export class AfAuthService {
  afUser$: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth, private router: Router) {
    // maintain user from authState
    this.afUser$ = this.getAuthState();
    this.afUser$.subscribe(user => {
      if (user) {
        this.router.navigate(['/app']);
      } else {
        return Observable.of(null);
      }
    });
  }

  /**
   * getter for authState
   * @return {Observable<firebase.User>}
   */
  getAuthState(): Observable<firebase.User> {
    return this.afAuth.authState;
  }

  /**
   * login to firebase with angularFire
   */
  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  /**
   * logout of firebase
   */
  logout() {
    this.router.navigate(['/login']);
    this.afAuth.auth.signOut();
  }
}
