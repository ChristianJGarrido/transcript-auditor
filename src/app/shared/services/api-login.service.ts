import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LeUser, LoginEvents } from '../interfaces/interfaces';
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

  // events
  events$: BehaviorSubject<LoginEvents> = new BehaviorSubject({
    loggingIn: false,
    isLoggedIn:
      this.bearer && sessionStorage.getItem('transcriptAuditorLoggedIn') === 'true' ? true : false
  });

  constructor(private http: HttpClient, private afAuthService: AfAuthService) {}

  /**
   * Helper to manage events
   */
  manageEvents(isLoggedIn: boolean = false, loggingIn: boolean = false) {
    sessionStorage.setItem('transcriptAuditorLoggedIn', isLoggedIn ? 'true' : 'false');
    this.bearer = isLoggedIn ? this.bearer : null;
    if (!isLoggedIn) {
      sessionStorage.removeItem('transcriptAuditorBearer');
    }
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
          this.manageEvents(true);
        } else {
          this.manageEvents();
        }
      },
      error => {
        this.manageEvents();
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
      this.manageEvents(true);
    }
  }

  /**
   * Initiate LiveEngage API Login process
   * @param account
   */
  login(user): void {
    this._timerToggle(true);
    this.manageEvents(false, true);
    this._configureTransport(user);
  }

  /**
   * Logout of LiveEngage
   */
  logout(): void {
    this.manageEvents();
  }
}
