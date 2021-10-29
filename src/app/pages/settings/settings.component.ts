import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  //Holds the document that has the user profile settings.
  private document!: AngularFirestoreDocument<UserProfile>;

  //User id string.
  uid: string | undefined;

  //Holds an observable of the user profile details.
  //Used to get a UserProfile struct with all the details that can be edited.
  profileDetails!: Observable<UserProfile | undefined>;

  //Interface object that will be used to hold the modified data.
  userProfile: UserProfile = {
      country: '',
      userName: '',
      dob: '',
      email: '',
      firstName: '',
      lastName: '',
      uid: '',
      createdt: '',
      moddt: '',
  }

  constructor(
    private dataStorage: DataStorageService,
    private auth: AngularFireAuth,
  ) {}

  async ngOnInit() {
    this.uid = (await this.auth.currentUser)?.uid;
    if (this.uid !== undefined) {
      this.document = this.dataStorage.getProfileDetails(this.uid);
      this.profileDetails = this.document.valueChanges();             //Gets the profile details struct.

      //Subscribe to the component to get the data and store it locally in userProfile.
      this.profileDetails.subscribe(profile => {
        if(profile != undefined)
          this.userProfile = profile;
      })
    }
  }

  //Runs updateProfileDetails with the new data after the user clicks submit.
  //Updates the user data in the database.
  onSubmit(): void {
    this.dataStorage.updateProfileDetails(this.userProfile);
  }

}
