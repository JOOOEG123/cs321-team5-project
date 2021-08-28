import { SignUpComponent } from './signUp/signUp.component';
import { SignInComponent } from './signIn/signIn.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomepageNoAuthComponent } from './homepageNoAuth/homepageNoAuth.component';
import { Routes } from '@angular/router';

export const PagesComponent = [
  HomepageNoAuthComponent,
  HomepageComponent,
  SignInComponent,
  SignUpComponent,
];

export const PagesRoutes: Routes = [];
