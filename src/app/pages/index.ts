import { SignUpComponent } from './signUp/signUp.component';
import { SignInComponent } from './signIn/signIn.component';
import { HomepageComponent } from './homepage/homepage.component';
import { HomepageNoAuthComponent } from './homepageNoAuth/homepageNoAuth.component';
import { AboutUsComponent } from './about-us/about-us.component';
import { Routes } from '@angular/router';
import { AngularFireAuthGuard, canActivate } from '@angular/fire/auth-guard';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { onlyAllowSeft, redirectLoggedInToByRoutes } from '../app-routing.pipe';
import { MapSelectComponent } from './map-select/map-select.component';
import { AddModalComponent } from './map-select/add-modal/add-modal.component';
import { MapViewComponent } from './map-view/map-view.component';
import { SettingsComponent } from './settings/settings.component';

export const PagesComponent = [
  HomepageNoAuthComponent,
  HomepageComponent,
  SignInComponent,
  SignUpComponent,
  UserProfileComponent,
  AboutUsComponent,
  MapSelectComponent,
  AddModalComponent,
  MapViewComponent,
  SettingsComponent
];

export const PagesRoutes: Routes = [
  {
    path: 'SignUp',
    component: SignUpComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToByRoutes, title: 'Sign Up' },
  },
  {
    path: 'SignIn',
    component: SignInComponent,
    canActivate: [AngularFireAuthGuard],
    data: { authGuardPipe: redirectLoggedInToByRoutes, title: 'Sign In' },
  },
  {
    path: 'dashboard/:id',
    canActivate: [AngularFireAuthGuard],
    component: HomepageComponent,
    data: { authGuardPipe: onlyAllowSeft, title: 'Dashboard' },
  },
  {
    path: 'profile/:id',
    canActivate: [AngularFireAuthGuard],
    component: UserProfileComponent,
    data: { authGuardPipe: onlyAllowSeft, title: 'Profile' },
  },
  {
    path: 'map-select',
    canActivate: [AngularFireAuthGuard],
    component: MapSelectComponent,
    data: { title: 'Map Select' },
  },
  // probably should accept an id here. I'm concerned about sharing that link and editing others' maps
  {
    path: 'map-view',
    canActivate: [AngularFireAuthGuard],
    component: MapViewComponent,
    data: { title: 'Map View' },
  },
  {
    path: 'map-view/:id',
    canActivate: [AngularFireAuthGuard],
    component: MapViewComponent,
    data: { title: 'Map View' },
  },

  // Routing for the AboutUsComponent.
  // Added by Renato Scudere.
  {
    path: 'AboutUs',
    component: AboutUsComponent,
    data: {title: 'About Us'}
  },

  //Routing for SettingsComponent
  {
    path: 'settings/:id',
    canActivate: [AngularFireAuthGuard],
    component: SettingsComponent,
    data: {title: 'Settings'}
  }
];
