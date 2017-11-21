import { Component, OnInit } from '@angular/core';

// services
import { AfAuthService } from '../shared/services/af-auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private afAuthService: AfAuthService) {}

  /**
   * Login to firebase
   */
  login() {
    this.afAuthService.login();
  }

  ngOnInit() {}
}
