import { Component, OnInit } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-auth-error-display',
  templateUrl: './auth-error-display.component.html'
})
export class AuthErrorDisplayComponent implements OnInit {
  errors: any[] = [];
  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.auth.authError.subscribe((x: any) => {
      this.errors = x;
    });
  }

  onClosed(){
    this.auth.clearErrors();
  }
}
