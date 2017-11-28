import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { StoreModel } from '../app.store';
import * as AfLoginActions from '../shared/store/af-login/af-login.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private store: Store<StoreModel>) {}

  /**
   * Login to firebase
   */
  login() {
    this.store.dispatch(new AfLoginActions.GoogleLogin());
  }

  ngOnInit() {
    this.store.dispatch(new AfLoginActions.GetUser());
  }
}
