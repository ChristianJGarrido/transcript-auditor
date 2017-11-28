import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ApiLoginService } from './api-login.service';
import { ExportService } from './export.service';
import {
  AfConversation,
  AfConversationData,
  AfConversationForm,
  ApiConversationHistoryRecord,
  AfAccount,
  AfUser
} from '../interfaces/interfaces';

import { combineLatest } from 'rxjs/operators';

import { Store } from '@ngrx/store';
import { StoreModel } from '../../app.store';
import { AfLoginState } from '../store/af-login/af-login.model';

// 3rd party
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';
import { Subscription } from 'rxjs/Subscription';

@Injectable()
export class AfDataService {
  // streams
  afConversationRef: AngularFirestoreCollection<AfConversationData>;
  afConversationData$: BehaviorSubject<AfConversationData[]> = new BehaviorSubject(null);
  afAccountsRef: AngularFirestoreCollection<AfAccount>;
  afAccountsData$: BehaviorSubject<AfAccount[]> = new BehaviorSubject(null);

  // user streams
  afUserReady$: BehaviorSubject<boolean> = new BehaviorSubject(false);
  afUsersRef: AngularFirestoreDocument<AfUser>;
  afUsersData$: Observable<AfUser>;

  // subscriptions
  afUserSub: Subscription;
  afAccountsDataSub: Subscription;
  afConversationDataSub: Subscription;

  // timeout for save
  afSave$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  updateTimeout;

  // user details
  user: AfUser;

  // store
  afLogin$: Observable<AfLoginState>;

  constructor(
    private store: Store<StoreModel>,
    private apiLoginService: ApiLoginService,
    private afStore: AngularFirestore,
    private exportService: ExportService
  ) {

    this.afLogin$ = this.store.select(state => state.afLogin);

    // wait for user to be ready, then subscribe to data store
    this.afUserReady$.subscribe(ready => {
      if (ready) {
        // subscribe to data store
        if (!environment.production) {
          console.log('Subscribing to data');
        }
        this.afConversationDataSub = this.getAfData().subscribe(data => {
          this.afConversationData$.next(data);
        });
        this.afAccountsDataSub = this.getAfAllData().subscribe(data => {
          this.afAccountsData$.next(data);
        });
      } else {
        // unsubscribe to data store
        if (this.afConversationDataSub) {
          this.afConversationDataSub.unsubscribe();
        }
        if (this.afAccountsDataSub) {
          this.afAccountsDataSub.unsubscribe();
        }
        if (this.afUserSub) {
          this.afUserSub.unsubscribe();
        }
      }
    });

    // subscribe to AF and API auth events
    this.afLogin$
      .pipe(combineLatest(this.apiLoginService.events$))
      .subscribe(([user, loginEvents]) => {
        if (user.uid && loginEvents.isLoggedIn) {
          // save user
          this.user = this.createUser(user);
          // bind to uid
          this.afUsersRef = this.afStore.collection(`users`).doc(user.uid);
          // check user exists and bind to database
          this.checkUserExists();
        } else {
          // clear observables if not signed into firebase
          this.clearData();
        }
      });
  }

  /**
   * Helper method to clear data
   */
  clearData() {
    if (!environment.production) {
      console.log('Clearing data');
    }
    this.afUserReady$.next(false);
    // clear firebase refs
    this.afAccountsRef = null;
    this.afConversationRef = null;
    // emit null data
    this.afConversationData$.next(null);
    this.afAccountsData$.next(null);
  }

  /**
   * Creates a user
   * @param {AfLoginState} user
   * @return {AfUser}
   */
  createUser(user: AfLoginState): AfUser {
    return {
      createdAt: new Date(),
      email: user.email,
      displayName: user.displayName,
      accounts: [this.apiLoginService.user.account],
      admin: this.apiLoginService.isLPA
    };
  }

  /**
   * Add new user account on login
   */
  addUserAccount(): void {
    this.afUserSub = this.afUsersRef.valueChanges().subscribe(user => {
      const account = this.apiLoginService.user.account;
      if (!user.accounts.includes(account)) {
        this.afUsersRef.update({ accounts: [...user.accounts, account] });
      }
    });
  }

  /**
   * Check if user exists in database - create if not
   */
  checkUserExists(): void {
    this.afUsersRef
      .update({})
      .then(() => {
        if (!environment.production) {
          console.log('User found');
        }
        this.addUserAccount();
        this.afUsersData$ = this.afUsersRef.valueChanges();
        this.afUserReady$.next(true);
      })
      .catch(() =>
        this.afUsersRef
          .set(this.user)
          .then(() => {
            if (!environment.production) {
              console.log('User created');
            }
            this.afUsersData$ = this.afUsersRef.valueChanges();
            this.afUserReady$.next(true);
          })
          .catch(() => {
            if (!environment.production) {
              console.log('Error creating user');
            }
          })
      );
  }

  /**
   * Returns observable of firebase specific account data
   * @return {Observable<AfConversationData[]>}
   */
  getAfData(): Observable<AfConversationData[]> {
    // set account number: depend on token
    const account: string = this.apiLoginService.bearer ? this.apiLoginService.user.account : null;
    // attach af data
    this.afConversationRef = this.afStore.doc(`accounts/${account}`).collection('conversations');
    // return observable stream
    return this.afConversationRef.valueChanges();
  }

  /**
   * Returns observable of firebase all account data
   * @return {Observable<AfConversationData[]>}
   */
  getAfAllData(): Observable<AfAccount[]> {
    // attach af data
    this.afAccountsRef = this.afStore.collection(`accounts`);
    // return observable stream
    return this.afAccountsRef.valueChanges();
  }

  /**
   * Emit new saved value
   */
  toggleSave(save: string | null) {
    this.afSave$.next(save);
  }

  /**
   * Modify firebase with new data for given conversation
   * @param {string} id
   * @param {string} select
   */
  updateConversation(id: string, data: AfConversationForm): void {
    clearTimeout(this.updateTimeout);
    // prepare payload
    const payload: AfConversationData = {
      conversationId: id,
      lastUpdateBy: this.user.displayName,
      lastUpdateTime: new Date(),
      data: {
        ...data
      }
    };
    // send data to firebase
    this.afConversationRef
      .doc(id)
      .set(payload, { merge: true })
      .then(() => {
        // emit saved
        this.toggleSave('saved');
        // reset saved
        this.updateTimeout = setTimeout(() => this.toggleSave(null), 5000);
      })
      .catch(err => {
        if (!environment.production) {
          console.log('Error while saving');
        }
        this.toggleSave(null);
      });
  }
}
