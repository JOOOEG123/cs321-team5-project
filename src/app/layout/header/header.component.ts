import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AuthService } from '@core/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  isLogIn:boolean = this.auth.user != null;
  constructor(private auth: AuthService, private authfire: AngularFireAuth) { }

  async ngOnInit() {
    this.authfire.authState.subscribe(x => console.log(x));
    // console.log(j)


    // this.isLogIn = await this.auth.authState.toPromise();

    this.auth.authState.subscribe(x=> this.isLogIn = x);
  }

  signOut() {
    this.auth.signOut();
  }

}
