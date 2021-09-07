import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthUser } from '@core/models/auth/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _authState = new BehaviorSubject<boolean>(false);
  readonly authState = this._authState.asObservable();
  user:any;

  constructor(
    private auth: AngularFireAuth,
    private router: Router,
    private dataStorage: DataStorageService
  ) {
    this.auth.currentUser.then(x=>{
      if(x) {
        this.user = x;
        this._authState.next(true);
      }
    });

  }

  async signInOrSignOut(user: AuthUser, isSignIn: boolean) {
    try {
      let apiCall;
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
      }

      this.routeOnLogin();
    } catch (err) {}
  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['hp', 'SignIn']);
    console.log('signOut');
    this._authState.next(false);
  }

  async getAuthState() {
    return await this.authState.toPromise();
  }

  async routeOnLogin() {
    const user = await this.auth.currentUser;
    const token = await user?.getIdTokenResult();
    if (token) {
      this._authState.next(true)
      this.router.navigate(['hp', 'profile', user?.uid]);
    }
  }
}
