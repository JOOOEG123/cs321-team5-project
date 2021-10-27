import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '@core/services/auth/auth.service';

// Copied what was in the header to get the uid and make sign out link work.
@Component({
  selector: 'app-user-nav-bar',
  templateUrl: './user-nav-bar.component.html',
  styleUrls: ['./user-nav-bar.component.scss']
})
export class UserNavBarComponent implements OnInit{

  isLogin = false;
  uid: string | undefined;

  constructor(private auth: AuthService, private authfire: AngularFireAuth) {}

  ngOnInit() {
    this.authfire.authState.subscribe((x) => {
      this.isLogin = x != null;
      this.uid = x?.uid
    });
  }

  signOut() {
    this.auth.signOut();
  }

}
