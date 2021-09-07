import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isLogIn = false;
  constructor(private auth: AuthService, private authfire: AngularFireAuth) {}

  ngOnInit() {
    this.authfire.authState.subscribe((x) => (this.isLogIn = x != null));
  }

  signOut() {
    this.auth.signOut();
  }

  getAuthState() {
    return this.authfire.authState.toPromise();
  }
}
