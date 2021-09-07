import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';
import { DataStorageService } from '@core/services/data-storage/dataStorage.service';

@Component({
  selector: 'app-signUp',
  templateUrl: './signUp.component.html',
  styleUrls: ['./signUp.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm = this.createForm();

  formConst = [
    {
      formControl: 'firstName',
      placeholder: 'First Name',
    },
    {
      formControl: 'lastName',
      placeholder: 'Last Name',
    },
    {
      formControl: 'userName',
      placeholder: 'Username',
    },
    {
      formControl: 'email',
      placeholder: 'Email address',
    },
    {
      formControl: 'password',
      placeholder: 'Password',
      type: 'password',
    },
    {
      formControl: 'confirmPassword',
      placeholder: 'Confirm Password',
      type: 'password',
    },
    {
      formControl: 'dob',
      placeholder: 'Date of Birth',
      type: 'date',
    },
    {
      formControl: 'country',
      placeholder: 'Country',
      type: 'datalist',
    },
  ];

  listOfCountries: any;
  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private dataserv: DataStorageService
  ) {
    this.dataserv.getCountry().then((x) => (this.listOfCountries = x));
  }

  ngOnInit() {}

  createForm() {
    return this.fb.group(
      {
        country: ['', Validators.required],
        dob: ['', Validators.required],
        email: ['', Validators.required],
        firstName: ['', Validators.required],
        lastName: ['', Validators.required],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        userName: ['', Validators.required],
      },
      {
        validators: [this.comparePasswords],
      }
    );
  }

  comparePasswords(control: AbstractControl): ValidationErrors | null {
    const { password, confirmPassword } = control.value;
    return password !== confirmPassword ? { noMatch: true } : null;
  }

  register() {
    this.auth.signInOrSignOut(this.signUpForm.value, false);
  }
}
