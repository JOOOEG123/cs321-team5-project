import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestoreDocument } from '@angular/fire/firestore';
import { UserProfile } from '@core/models/auth/auth.model';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';
import { Observable } from 'rxjs';
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private document!: AngularFirestoreDocument<UserProfile>;
  uid: string | undefined;
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
    private formBuilder: FormBuilder,
  ) {}

  //Form used to get data from the user as input.
  accountData = this.formBuilder.group({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    country: '',
    birthday: '',
  });

  async ngOnInit() {
    this.uid = (await this.auth.currentUser)?.uid;
    if (this.uid !== undefined) {
      this.document = this.dataStorage.getProfileDetails(this.uid);
      this.profileDetails = this.document.valueChanges();

      //Subscribe to the component to get the data and store it locally in userProfile.
      this.profileDetails.subscribe(profile => {
        if(profile != undefined)
          this.userProfile = profile;
      })
    }
  }

  //Runs updateProfileDetails with the new data after the user clicks submit.
  onSubmit(): void {

    this.dataStorage.updateProfileDetails(this.userProfile);
  }

}
