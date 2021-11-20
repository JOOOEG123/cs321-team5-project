import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularFireModule } from '@angular/fire';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { environment } from 'src/environments/environment';

import { AuthErrorDisplayComponent } from './auth-error-display.component';

describe('AuthErrorDisplayComponent', () => {
  let component: AuthErrorDisplayComponent;
  let fixture: ComponentFixture<AuthErrorDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        BrowserModule,
        CommonModule,
        FormsModule,
        RouterModule,
        ReactiveFormsModule,
        AngularFireModule.initializeApp(environment.firebase),
        RouterModule.forRoot([]),
      ],
      providers: [
        BrowserModule,
        CommonModule,
        AngularFireModule,
        HttpClientModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule
      ],
      declarations: [ AuthErrorDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthErrorDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
