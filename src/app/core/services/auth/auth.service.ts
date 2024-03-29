import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthUser } from '@core/models/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authState = new BehaviorSubject<boolean>(false);
  readonly authState = this._authState.asObservable();
  private _authError = new BehaviorSubject<any[]>([]);
  readonly authError = this._authError.asObservable();
  user: any;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private dataStorage: DataStorageService
  ) {}

  async signInOrSignOut(user: AuthUser, isSignIn: boolean) {
    let apiCall;
    try {
      const { firstName, lastName, email, password } = user;
      if (isSignIn) {
        apiCall = await this.auth.signInWithEmailAndPassword(email, password);
      } else {
        apiCall = await this.auth.createUserWithEmailAndPassword(
          email,
          password
        );
        await apiCall.user?.updateProfile({
          displayName: `${firstName} ${lastName}`,
        });

        const userd = await this.auth.currentUser;
        if (!userd) {
          return;
        }

        this.dataStorage.setNewProfile({
          country: user.country,
          userName: user.userName,
          dob: user.dob,
          email: user.email,
          firstName,
          lastName,
          uid: userd.uid,
        });
        this._authError.next([]);
      }
      this.routeOnLogin();
    } catch (err) {
      this._authError.next([err]);
    }
    return apiCall;
  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['hp', 'Homepage']);
    this._authState.next(false);
  }

  async getAuthState() {
    return await this.authState.toPromise();
  }

  async routeOnLogin() {
    const user = await this.auth.currentUser;
    const token = await user?.getIdTokenResult();
    if (token) {
      this._authState.next(true);
      this.router.navigate(['hp', 'map-select']);   //['hp', 'profile', user?.uid]
    }
  }

  clearErrors() {
    this._authError.next([]);
  }
}
