import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

// 3rd party
import { AngularFireAuth } from 'angularfire2/auth';

@Injectable()
export class AfAuthGuardService implements CanActivate {
  constructor(public afAuth: AngularFireAuth, private router: Router) {}

  // return login status: true / false
  canActivate() {
    return this.afAuth.authState.map(auth => {
      if (!auth) {
        this.router.navigate(['/login']);
        return false;
      } else {
        return true;
      }
    });
  }
}
