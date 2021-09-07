import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth/auth.model';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

constructor(private httpClient: HttpClient, private fireStore: AngularFirestore) { }
  private _document!: AngularFirestoreDocument;
  async getCountry() {
    return await this.getAPI('https://restcountries.eu/rest/v2/all');
  }

  private getAPI<T>(path:any, params?:any) {
    return this.httpClient.get<T>(path).toPromise();
  }

  setNewProfile(profile:UserProfile){
    return this.fireStore.doc<UserProfile>(`users/${profile.uid}`).set(profile);
  }

  getProfileDetails(id:string) {
    this._document = this.fireStore.doc<UserProfile>(`users/${id}`);
    return this._document;
  }

  updateProfileDetails(profile:UserProfile){
    return this.fireStore.doc<UserProfile>(`users/${profile.uid}`).update(profile);
  }
}
