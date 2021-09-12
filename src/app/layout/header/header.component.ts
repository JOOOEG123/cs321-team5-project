import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '@core/services/auth/auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  isLogIn = false;
  uid: any;
  constructor(private auth: AuthService, private authfire: AngularFireAuth) {}

  async ngOnInit() {
    this.isLogIn =
      null != (await this.authfire.authState.pipe(take(1)).toPromise());
    if (this.isLogIn) {
      this.uid = (await this.authfire.currentUser)?.uid;
    }
  }

  signOut() {
    this.auth.signOut();
  }

  getAuthState() {
    return this.authfire.authState.toPromise();
  }
}
