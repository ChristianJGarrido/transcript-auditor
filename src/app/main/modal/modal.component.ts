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

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  user: LeUser;
  events$: Observable<LoginEvents>;

  constructor(
    private apiLoginService: ApiLoginService,
    private afAuthService: AfAuthService,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {
    // bind to login service events
    this.events$ = this.apiLoginService.events$;
    // update user from login service || set defaults
    if (this.apiLoginService.user) {
      this.user = this.apiLoginService.user;
    } else {
      this.user = {
        account: '',
        username: '',
        password: ''
      };
    }
  }

  /**
   * Login to LiveEngage with account/username/password
   * @param {NgForm} form
   */
  lelogin(): void {
    this.apiLoginService.login(this.user);
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

  ngOnInit() {}
}
