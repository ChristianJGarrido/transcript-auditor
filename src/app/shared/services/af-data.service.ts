import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AfAuthService } from './af-auth.service';
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
  afConversationData: AngularFirestoreCollection<AfConversationData>;
  afConversationData$: BehaviorSubject<AfConversationData[]> = new BehaviorSubject(null);
  afAccountsData: AngularFirestoreCollection<AfAccount>;
  afAccountsData$: Observable<AfAccount[]>;
  afUsersData: AngularFirestoreDocument<AfUser>;
  afUsersData$: Observable<AfUser>;
  isAdmin$: Observable<boolean>;

  // subscriptions
  afConversationDataSub: Subscription;

  // timeout for save
  afSave$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  updateTimeout;

  // user details
  user: AfUser;

  constructor(
    private afAuthService: AfAuthService,
    private apiLoginService: ApiLoginService,
    private afStore: AngularFirestore,
    private exportService: ExportService
  ) {
    this.afAuthService.afUser$
      .pipe(combineLatest(this.apiLoginService.events$))
      .subscribe(([user, loginEvents]) => {
        if (user && loginEvents.isLoggedIn) {
          // save user
          this.user = this.createUser(user);
          // bind to uid
          this.afUsersData = this.afStore.collection(`users`).doc(user.uid);
          // check user exists and bind to database
          this.afUsersData$ = this.checkUserExists(user);
          // subscribe to data store
          this.afConversationDataSub = this.getAfData().subscribe(data => {
            this.afConversationData$.next(data);
          });
        } else {
          // clear observables if not signed into firebase
          this.afConversationData$.next(null);
          if (this.afConversationDataSub) {
            this.afConversationDataSub.unsubscribe();
          }
          this.afAccountsData$ = Observable.of(null);
          this.afUsersData$ = Observable.of(null);
        }
      });
  }

  /**
   * Creates a user
   * @param {firebase.User} user
   * @return {AfUser}
   */
  createUser(user: firebase.User): AfUser {
    return {
      createdAt: new Date(),
      email: user.email,
      displayName: user.displayName,
      accounts: [this.apiLoginService.user.account],
      admin: this.apiLoginService.isLPA
    };
  }

  /**
   * Check if user exists in database
   * @param {firebase.User} user
   * @return {Observable<AfUser>}
   */
  checkUserExists(user: firebase.User): Observable<AfUser> {
    return this.afStore
      .collection(`users`)
      .doc(user.uid)
      .snapshotChanges()
      .switchMap(action => {
        if (!action.payload.exists) {
          this.afUsersData.set(this.user).then(() => {
            return this.afUsersData.valueChanges();
          });
        } else {
          return this.afUsersData.valueChanges();
        }
      });
  }

  /**
   * Returns observable of firebase specific account data
   * @return {Observable<AfConversationData[]>}
   */
  getAfData(): Observable<AfConversationData[]> {
    // set account number: depend on token
    const account: string = this.apiLoginService.bearer ? this.apiLoginService.user.account : null;
    // attach af data
    this.afConversationData = this.afStore.doc(`accounts/${account}`).collection('conversations');
    // return observable stream
    return this.afConversationData.valueChanges();
  }

  /**
   * Returns observable of firebase all account data
   * @return {Observable<AfConversationData[]>}
   */
  getAfAllData(): Observable<AfAccount[]> {
    // attach af data
    this.afAccountsData = this.afStore.collection(`accounts`);
    // return observable stream
    return this.afAccountsData.valueChanges();
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
    this.afConversationData
      .doc(id)
      .set(payload, { merge: true })
      .then(() => {
        // emit saved
        this.toggleSave('saved');
        // reset saved
        this.updateTimeout = setTimeout(() => this.toggleSave(null), 5000);
      })
      .catch(err => {
        console.log('Error while saving');
        this.toggleSave(null);
      });
  }
}
