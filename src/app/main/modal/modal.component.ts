import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LeUser, LoginEvents, AfUser } from '../../shared/interfaces/interfaces';
import { MatDialogRef } from '@angular/material';
import { AfAuthService } from '../../shared/services/af-auth.service';
import { ApiLoginService } from '../../shared/services/api-login.service';
import { AfDataService } from '../../shared/services/af-data.service';
import { ExportService } from '../../shared/services/export.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  leUser: LeUser;
  events$: BehaviorSubject<LoginEvents>;
  afUser$: Observable<AfUser>;

  constructor(
    private exportService: ExportService,
    private apiLoginService: ApiLoginService,
    private afDataService: AfDataService,
    private afAuthService: AfAuthService,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {}

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

  /**
   * Check to see if user is admin
   * @return {Observable<boolean>}
   */
  isAdmin(): Observable<boolean> {
    return this.afDataService.isAdmin$;
  }

  /**
   * Get all users
   */
  getAll(): void {
    // this.exportService.downloadAllNotes(this.afDataService.afAccountsData);
  }

  ngOnInit() {
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
    this.afUser$ = this.afDataService.afUsersData$;
    // this.afDataService.getAfAllData().subscribe();
  }

}
