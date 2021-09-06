import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthUser } from '@core/models/auth/auth.model';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private auth: AngularFireAuth, private router: Router) {}

  isLoggedIn() {
    return this.auth.authState.pipe(first()).toPromise();
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

        const user = await this.auth.currentUser;
        if (!user) {
          return;
        }
      }

      if (!(await this.isLoggedIn())) {
        return;
      }
    } catch (err) {}
  }

  signOut() {
    this.auth.signOut();
    this.router.navigate(['/']);
  }
}
