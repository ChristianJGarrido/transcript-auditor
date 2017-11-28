import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { LeUser, LoginEvents, AfUser, AfAccount } from '../../shared/interfaces/interfaces';
import { MatDialogRef } from '@angular/material';
import { ApiLoginService } from '../../shared/services/api-login.service';
import { AfDataService } from '../../shared/services/af-data.service';
import { ExportService } from '../../shared/services/export.service';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import * as AfLoginActions from '../../shared/store/af-login/af-login.actions';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit, OnDestroy {
  leUser: LeUser;
  events$: BehaviorSubject<LoginEvents>;
  afUser$: Observable<AfUser>;

  afAccountsSub: Subscription;
  afAccountsData: AfAccount[];

  constructor(
    private store: Store<StoreModel>,
    private exportService: ExportService,
    private apiLoginService: ApiLoginService,
    private afDataService: AfDataService,
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
    this.store.dispatch(new AfLoginActions.Logout());
  }

  /**
   * Get all users
   */
  getAll(): void {
    this.exportService.downloadAllNotes(this.afAccountsData);
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
    // bind to all account data
    this.afAccountsSub = this.afDataService.afAccountsData$.subscribe(data => this.afAccountsData = data);
  }

  ngOnDestroy() {
    this.afAccountsSub.unsubscribe();
  }

}
