import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-error-display',
  templateUrl: './auth-error-display.component.html',
  styleUrls: ['./auth-error-display.component.scss'],
})
export class AuthErrorDisplayComponent implements OnInit {
  errors: any[] = [];
  subErrors!: Subscription;
  constructor(private auth: AuthService) {}
  ngOnInit() {
    this.subErrors = this.auth.authError.subscribe((x: any) => {
      this.errors = x;
      if (x?.length === 0) {
        this.subErrors && this.subErrors.unsubscribe();
      }
    });
  }
}
