import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// services
import { AfAuthService } from './af-auth.service';

// interfaces
import { AfConversations, AfConversation, AfConversationData } from '../interfaces/interfaces';

// 3rd party
import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument
} from 'angularfire2/firestore';
import * as firebase from 'firebase/app';

@Injectable()
export class AfDataService {
  afData: AngularFirestoreDocument<AfConversations>;
  afData$: Observable<AfConversations>;

  constructor(private afStore: AngularFirestore, private afAuthService: AfAuthService) {
    // bind angular firebase to service variable
    this.afData$ = this.afAuthService.afUser$.switchMap(user => {
      if (user) {
        this.afData = this.afStore.doc<AfConversations>(`users/${user.uid}`);
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
