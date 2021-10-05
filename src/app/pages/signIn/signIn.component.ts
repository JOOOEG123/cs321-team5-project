import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-signIn',
  templateUrl: './signIn.component.html',
  styleUrls: ['./signIn.component.scss'],
})
export class SignInComponent implements OnInit {
  signInForm = this.createForm();
  formConst = [
    {
      formControl: 'email',
      placeholder: 'Email address',
    },
    {
      formControl: 'password',
      placeholder: 'Password',
      type: 'password',
    },
  ];

  listOfCountries: any;
  constructor(private fb: FormBuilder, private auth: AuthService) {}

  createForm() {
    return this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.auth.clearErrors();
  }

  signIn() {
    this.auth.signInOrSignOut(this.signInForm.value, true);
  }
}
