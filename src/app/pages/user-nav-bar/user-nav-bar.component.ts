import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-nav-bar',
  templateUrl: './user-nav-bar.component.html',
  styleUrls: ['./user-nav-bar.component.scss']
})

// Copied what was in the UserProfileComponent to get the name from the database.
export class UserNavBarComponent {
  private _document!: AngularFirestoreDocument<UserProfile>;
  uid: string | undefined;
  profileDetails!: Observable<UserProfile | undefined>;

  constructor(
    private dataStorage: DataStorageService,
    private auth: AngularFireAuth
  ) {}

  async ngOnInit() {
    this.uid = (await this.auth.currentUser)?.uid;
    if (this.uid !== undefined) {
      this._document = this.dataStorage.getProfileDetails(this.uid);
      this.profileDetails = this._document.valueChanges();
    }
  }

}
