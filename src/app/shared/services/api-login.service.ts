import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// interfaces
import { LeUser, LoginEvents } from '../interfaces/interfaces';

// services
import { AfAuthService } from './af-auth.service';

// 3rd party
import '../../../js/lpTransportSDK.js';
declare var lpTag: any;

@Injectable()
export class ApiLoginService {
  // api services used in this application
  private _services = ['agentVep', 'msgHist'];
  private _loginTimer;
  private _loginTimeout;

  // events
  events$: BehaviorSubject<LoginEvents> = new BehaviorSubject({
    loggingIn: false,
    isLoggedIn: false
  });

  // public properties
  user: LeUser = {
    account: sessionStorage.getItem('transcriptAuditorAccount') || '',
    username: sessionStorage.getItem('transcriptAuditorUsername') || '',
    password: ''
  };
  bearer: string = sessionStorage.getItem('transcriptAuditorBearer') || null;
  domains = sessionStorage.getItem('transcriptAuditorDomains')
    ? JSON.parse(sessionStorage.getItem('transcriptAuditorDomains'))
    : {
        msgHist: '',
        agentVep: ''
      };

  constructor(private http: HttpClient, private afAuthService: AfAuthService) {
    this.events$.subscribe(event => {
      if (event.isLoggedIn) {
        this._timerToggle(false);
      } else {
        this._timerToggle(true);
      }
    });
  }

  /**
   * Helper to manage events
   */
  private _manageEvents(isLoggedIn: boolean = false, loggingIn: boolean = false) {
    this.events$.next({
      isLoggedIn,
      loggingIn
    });
  }

  /**
   * configure LP Transport with account number and generate domain values
   * @param {LeUser} user
   */
  private _configureTransport(user: LeUser) {
    // restart timer
    this._loginTimeout = setTimeout(() => {
      this._setConfig(user);
    }, 5000);
    // configure transportSDK
    lpTag.transportSDK.configure({
      siteId: user.account,
      services: this._services,
      QA: false,
      callback: data => {
        clearTimeout(this._loginTimeout);
        this._setConfig(user);
      }
    });
  }

  /**
   * Save config after transportSDK configured
   * @param {LeUser} user
   */
  private _setConfig(user: LeUser): void {
    // get domain strings
    this._services.forEach(service => (this.domains[service] = this._getDomain(service)));
    sessionStorage.setItem('transcriptAuditorDomains', JSON.stringify(this.domains));
    // clear password and save user
    this.user = user;
    sessionStorage.setItem('transcriptAuditorAccount', this.user.account);
    sessionStorage.setItem('transcriptAuditorUsername', this.user.username);
  }

  /**
   * Using getDomain method of transportSDK to get the baseURIs
   * @param {string} service the service to lookup
   * @return {string}
   */
  private _getDomain(service: string): string {
    return lpTag.transportSDK.getDomain(service);
  }

  /**
   * Login to liveengage
   */
  private _liveEngageLogin(): void {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const url = `https://${this.domains.agentVep}/api/account/${this.user.account}/login`;
    const body = {
      username: this.user.username,
      password: this.user.password
    };
    this.http.post<any>(url, body, { headers }).subscribe(
      response => {
        if (response.bearer) {
          this.bearer = response.bearer;
          sessionStorage.setItem('transcriptAuditorBearer', this.bearer);
          this._manageEvents(true);
        } else {
          this._reset();
        }
      },
      error => {
        this._reset();
      }
    );
  }

  /**
   * Helper method to toggle timer before / after login
   * @param {boolean} enabled enabled state of timer
   */
  private _timerToggle(enabled: boolean): void {
    if (enabled) {
      // clear timer
      clearInterval(this._loginTimer);
      // restart timer
      this._loginTimer = setInterval(() => {
        this._checkLogin();
      }, 1000);
    }
  }

  /**
   * Helper method to toggle timer before / after login
   */
  private _checkLogin(): void {
    // wait for configured and auth from Transport, then login
    if (this.user && !this.bearer) {
      // navigate to app
      this._liveEngageLogin();
      // clear interval/timeout
      clearTimeout(this._loginTimeout);
      clearInterval(this._loginTimer);
    } else if (this.bearer) {
      // clear interval/timeout
      clearTimeout(this._loginTimeout);
      clearInterval(this._loginTimer);
      this._manageEvents(true);
    }
  }

  /**
   * Initiate LiveEngage API Login process
   * @param account
   */
  login(user): void {
    this._manageEvents(false, true);
    this._configureTransport(user);
  }

  /**
   * Helper method to reset events and timer
   */
  private _reset() {
    this.user = null;
    this._manageEvents();
    this._timerToggle(true);
  }

  /**
   * Logout of LiveEngage
   */
  logout(): void {
    this.bearer = null;
    sessionStorage.removeItem('transcriptAuditorBearer');
    this._reset();
  }
}
