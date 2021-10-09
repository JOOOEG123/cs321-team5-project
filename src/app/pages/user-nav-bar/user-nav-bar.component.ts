import { Component } from '@angular/core';
import { Router } from '@angular/router'

@Component({
  selector: 'app-user-nav-bar',
  templateUrl: './user-nav-bar.component.html',
  styleUrls: ['./user-nav-bar.component.scss']
})
export class UserNavBarComponent {

  url="";

  constructor(private router: Router) {
    this.url = this.router.url;
  }

}
