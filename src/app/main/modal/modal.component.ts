import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

// interfaces
import { LeUser, LoginEvents } from '../../shared/interfaces/interfaces';

// material
import { MatDialogRef } from '@angular/material';

// services
import { AfAuthService } from '../../shared/services/af-auth.service';
import { ApiLoginService } from '../../shared/services/api-login.service';
import { AfDataService } from '../../shared/services/af-data.service';

// 3rd party
import * as firebase from 'firebase/app';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  leUser: LeUser;
  events$: Observable<LoginEvents>;
  afUser$: Observable<firebase.User>;

  constructor(
    private apiLoginService: ApiLoginService,
    private afDataService: AfDataService,
    private afAuthService: AfAuthService,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {
    // bind to login service events
    this.events$ = this.apiLoginService.events$;
    // update LE user from login service || set defaults
    if (this.apiLoginService.user) {
      this.leUser = this.apiLoginService.user;
    } else {
      this.leUser = {
        account: '',
        username: '',
        password: ''
      };
    }
    // bind to firebase user
    this.afUser$ = this.afAuthService.getAuthState();
  }

  /**
   * Login to LiveEngage with account/username/password
   * @param {NgForm} form
   */
  lelogin(): void {
    this.apiLoginService.login(this.leUser);
  }

  /**
   * Logout of LiveEngage
   */
  lelogout(): void {
    this.apiLoginService.logout();
  }

  /**
   * logout of transcript auditor
   */
  logout(): void {
    this.dialogRef.close();
    this.afAuthService.logout();
  }

  isAdmin(): Observable<boolean> {
    return this.afDataService.isAdmin$;
  }

  /**
   * Get all users
   */
  getAll(): void {
    // this.afDataService.getAllData();
  }

  ngOnInit() {}
}
