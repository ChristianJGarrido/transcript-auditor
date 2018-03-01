import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '../app.store';
import * as AfLoginActions from '../shared/store/af-login/af-login.actions';
import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store: Store<StoreModel>, public dialog: MatDialog) {}

  /**
   * Login to firebase
   */
  login() {
    this.store.dispatch(new AfLoginActions.GoogleLogin());
  }

  ngOnInit() {
    this.store.dispatch(new AfLoginActions.GetUser());
    this.dialog.closeAll();
  }
}
