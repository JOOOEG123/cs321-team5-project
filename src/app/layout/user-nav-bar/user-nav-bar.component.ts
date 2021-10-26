import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '@core/services/auth/auth.service';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { Observable } from 'rxjs';

// Copied what was in the UserProfileComponent to get the name from the database.
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
