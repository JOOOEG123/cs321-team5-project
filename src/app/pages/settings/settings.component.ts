import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { Observable, Subscription } from 'rxjs';
import firebase from 'firebase/app';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit, OnDestroy{
  //Holds the document that has the user profile settings.
  private document!: AngularFirestoreDocument<UserProfile>;

  //User id string.
  uid: string | undefined;

  //Holds the email address before changes.
  private prevEmail: string | undefined;

  //Used to notify the user of the success or failure of changing email.
  title: string | undefined;
  message: string | undefined;

  //Holds an observable of the user profile details.
  //Used to get a UserProfile struct with all the details that can be edited.
  profileDetails!: Observable<UserProfile | undefined>;

  //Used to unsubscribe from the Observable.
  private unsub: Subscription | undefined;

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
  };

  constructor(
    private dataStorage: DataStorageService,
    private auth: AngularFireAuth
  ) {}

  async ngOnInit() {
    this.uid = (await this.auth.currentUser)?.uid;
    if (this.uid !== undefined) {
      this.document = this.dataStorage.getProfileDetails(this.uid);
      this.profileDetails = this.document.valueChanges(); //Gets the profile details struct.

      //Subscribe to the component to get the data and store it locally in userProfile.
      //Saves the previous email address for later use.
      this.unsub = this.profileDetails.subscribe((profile) => {
        if (profile != undefined) this.userProfile = profile;
        if (profile?.email != null) this.prevEmail = profile.email;
      });
    }
  }

  //Unsubscribes when the page is closed.
  ngOnDestroy() {
    this.unsub?.unsubscribe();
  }

  //Runs updateProfileDetails with the new data after the user clicks submit.
  //Updates the user data in the database and the login email in the authentication section.
  onSubmit(): void {
    //Makes sure email is only changed if the email field input is not null..
    if (this.userProfile.email != null) {
      firebase
        .auth()
        .currentUser?.updateEmail(this.userProfile.email)
        .then(() => {
          this.title = 'Changes Successful.';
          this.message =
            'Your changes have been saved. Please check your "Account Details" page to see the reflected changes.';

          //Changes made only if the email was properly updated.
          this.dataStorage.updateProfileDetails(this.userProfile);
        })
        .catch((error) => {
          this.title = 'Unable to Save Changes.';
          this.message = 'Please sign-in again to save changes';
        });
    }
  }
}
