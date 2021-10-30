import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth.model';
import { Pin } from '@core/models/map-tracker.model';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor(
    private httpClient: HttpClient,
    private fireStore: AngularFirestore
  ) {}
  private _document!: AngularFirestoreDocument<UserProfile>;
  async getCountry() {
    return await this.getAPI('https://restcountries.eu/rest/v2/all');
  }
  private getAPI<T>(path: any, params?: any) {
    return this.httpClient.get<T>(path).toPromise();
  }

  private getDocFunc(id: string | undefined) {
    return this.fireStore.doc<any>(`user-maps/${id}`);
  }

  setNewProfile(profile: UserProfile) {
    profile.createdt = new Date().toDateString();
    profile.moddt = new Date().toDateString();
    return this.fireStore.doc<UserProfile>(`users/${profile.uid}`).set(profile);
  }

  getProfileDetails(id: string) {
    this._document = this.fireStore.doc<UserProfile>(`users/${id}`);
    return this._document;
  }

  updateProfileDetails(profile: UserProfile) {
    profile.moddt = new Date().toDateString();
    return this.fireStore
      .doc<UserProfile>(`users/${profile.uid}`)
      .update(profile);
  }

  addUserMap(mapObj: any, id: string | undefined) {
    try {
      return this.fireStore.doc<any>(`user-maps/${id}`).set(mapObj);
    } catch (error) {
      throw error;
    }
  }

  addUserPins(pins: Pin[], uid: string | undefined, mapId: string | undefined) {
    try {
      return this.fireStore
        .doc<any>(`${mapId}/${uid}`)
        .set({ user_pins: pins });
    } catch (error) {
      throw error;
    }
  }
  removeUserPins(uid: string | undefined, mapId: string | undefined) {
    try {
      return this.fireStore.doc<any>(`user_pins/${uid}`)
    } catch (error) {
      throw error;
    }
  }

  getUserMap(id: string | undefined) {
    return this.getDocFunc(id).get();
  }

  getUserPin(uid: string | undefined, mapId: string | undefined) {
    return this.fireStore.doc<any>(`user_pins/${mapId}/${uid}`).get()
  }
}
