import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { MatDialogRef } from '@angular/material';
import { ApiLoginService } from '../../shared/services/api-login.service';
import { ExportService } from '../../shared/services/export.service';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import * as ApiLoginActions from '../../shared/store/api-login/api-login.actions';
import * as AfLoginActions from '../../shared/store/af-login/af-login.actions';
import { AfLoginModel } from '../../shared/store/af-login/af-login.model';
import { ApiLoginModel, ApiLoginUser } from '../../shared/store/api-login/api-login.model';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent implements OnInit {
  afLogin$: Observable<AfLoginModel>;
  apiLogin$: Observable<ApiLoginModel>;

  leUser: ApiLoginUser = {
    username: '',
    account: '',
    password: '',
  };

  constructor(
    private store: Store<StoreModel>,
    private exportService: ExportService,
    private apiLoginService: ApiLoginService,
    public dialogRef: MatDialogRef<ModalComponent>
  ) {}

  /**
   * Login to LiveEngage with account/username/password
   * @param {NgForm} form
   */
  lelogin(): void {
    this.store.dispatch(new ApiLoginActions.GetDomains());
    this.apiLoginService.getDomains(this.leUser);
  }

  /**
   * Logout of LiveEngage
   */
  lelogout(): void {
    this.store.dispatch(new ApiLoginActions.NotAuthenticated());
  }

  /**
   * logout of transcript auditor
   */
  logout(): void {
    this.dialogRef.close();
    this.store.dispatch(new AfLoginActions.Logout());
  }

  ngOnInit() {
    this.afLogin$ = this.store.select(state => state.afLogin);
    this.apiLogin$ = this.store.select(state => state.apiLogin);
  }

}
