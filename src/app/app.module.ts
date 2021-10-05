import { environment } from './../environments/environment';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AllLayoutComponents } from './layout';
import { PagesComponent } from './pages';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from '@core/modules/ngx-bootstrap/ngx-bootstrap.module';
import { AuthErrorDisplayComponent } from './shared/auth-error-display/auth-error-display.component';
import { SharedComponent } from './shared';



@NgModule({
  declarations: [
    AppComponent,
    ...AllLayoutComponents,
    ...PagesComponent,
    ...SharedComponent
  ],
  imports: [
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFirestoreModule,
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxBootstrapModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
