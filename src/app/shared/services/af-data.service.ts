import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// services
import { AfAuthService } from './af-auth.service';
import { ExportService } from './export.service';

// interfaces
import { AfUser, AfConversation, AfConversationData, AfUsers } from '../interfaces/interfaces';

// 3rd party
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class AfDataService {
  afData: AngularFirestoreDocument<AfUser>;
  afData$: Observable<AfUser>;
  afAllData$: Observable<any>;
  isAdmin$: Observable<boolean>;

  constructor(
    private afStore: AngularFirestore,
    private afAuthService: AfAuthService,
    private exportService: ExportService
  ) {
    // bind angular firebase to service variable
    this.afData$ = this.afAuthService.afUser$.switchMap(user => {
      if (user) {
        // select user data
        this.afData = this.afStore.doc<AfUser>(`users/${user.uid}`);
        this.afData.snapshotChanges().subscribe(action => {
          if (!action.payload.exists) {
            this.afData.set({ createdAt: new Date() }, { merge: true });
          }
        });

        // check if admin
        this.isAdmin$ = this.afStore
          .doc(`admins/${user.uid}`)
          .snapshotChanges()
          .switchMap(action => {
            if (action.payload.exists) {
              this.afAllData$ = this.afStore.collection('/users').valueChanges();
            } else {
              this.afAllData$ = Observable.of(null);
            }
            return Observable.of(action.payload.exists);
          });

        return this.afData.valueChanges();
      } else {
        this.afData = null;
        return Observable.of(null);
      }
    });
  }

  /**
   * Modify firebase with new data for given conversation
   * @param {string} id
   * @param {string} select
   */
  updateConversation(id: string, data: AfConversationData): void {
    const payload = {
      conversations: {
        [id]: data
      }
    };
    this.afData.set(payload, { merge: true });
  }

}
