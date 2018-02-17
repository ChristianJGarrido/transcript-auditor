import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { LeUser, LoginEvents } from '../interfaces/interfaces';
import * as ApiLoginActions from '../store/api-login/api-login.actions';

// 3rd party
import '../../../js/lpTransportSDK.js';
import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
declare var lpTag: any;

@Injectable()
export class ApiLoginService {
  private services = ['agentVep', 'msgHist', 'engHistDomain'];
  private domainTimeout;
  private loginInterval;
  private domains = {
    msgHist: '',
    agentVep: '',
    engHistDomain: '',
  };
  private saved = false;

  constructor(private store: Store<StoreModel>) {}

  /**
   * configure LP Transport with account number and generate domain values
   * @param {any} user
   * @param {string} user.account
   * @param {string} user.username
   * @param {string} user.password
   */
  private configureTransport(user) {
    // restart timer
    this.domainTimeout = setTimeout(() => {
      this.saveDomains(user);
    }, 5000);
    // configure transportSDK
    lpTag.transportSDK.configure({
      siteId: user.account,
      services: this.services,
      QA: false,
      callback: data => {
        clearTimeout(this.domainTimeout);
        this.saveDomains(user);
      },
    });
  }

  /**
   * Save config after transportSDK configured
   */
  private saveDomains(user): void {
    this.services.forEach(
      service => (this.domains[service] = this.getDomain(service))
    );
    this.saved = true;
  }

  /**
   * Using getDomain method of transportSDK to get the baseURIs
   * @param {string} service the service to lookup
   * @return {string}
   */
  private getDomain(service: string): string {
    return lpTag.transportSDK.getDomain(service);
  }

  /**
   * Initiate LiveEngage API Login process
   * @param user
   */
  getDomains(user): void {
    this.saved = false;
    this.loginInterval = setInterval(() => {
      if (this.saved) {
        this.saved = false;
        this.store.dispatch(new ApiLoginActions.Login(user, this.domains));
        clearInterval(this.loginInterval);
      }
    }, 1000);
    this.configureTransport(user);
  }

}
