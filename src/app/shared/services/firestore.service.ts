import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AssessmentModel } from '../store/assessment/assessment.model';
import { PlaylistModel } from '../store/playlist/playlist.model';
import { AfUser } from '../store/af-login/af-login.model';

@Injectable()
export class FirestoreService {

  constructor(public afStore: AngularFirestore) {}

  getUser(uid: string): AngularFirestoreDocument<AfUser> {
    return this.afStore.doc(`users/${uid}`);
  }

  getAssessments(account: string): AngularFirestoreCollection<AssessmentModel> {
    return this.getCollection(account, 'assessments');
  }

  getPlaylists(account: string): AngularFirestoreCollection<PlaylistModel> {
    return this.getCollection(account, 'playlists');
  }

  /**
   * returns firestore collection
   * @param {string} account
   * @param {string} collection
   * @return {AngularFirestoreCollection<{}>}
   */
  getCollection(account: string, collection: string): AngularFirestoreCollection<any> {
    return this.afStore
      .doc(`accounts/${account}`)
      .collection(collection, ref => ref.orderBy('createdAt', 'asc'));
  }

  /**
   * returns firestore document
   * @param {string} account
   * @param {string} collection
   * @param {string} id
   * @param {AngularFirestoreDocument<{}>}
   */
  getDocument(account: string, collection: string, id: string): AngularFirestoreDocument<any> {
    return this.getCollection(account, collection).doc(id);
  }

  /**
   * returns a unique id
   * @return {string}
   */
  /* tslint:disable:no-bitwise */
  createUUID(): string {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = ((dt + Math.random() * 16) % 16) | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }
}
