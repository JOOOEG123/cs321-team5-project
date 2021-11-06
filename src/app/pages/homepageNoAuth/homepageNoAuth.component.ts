import { Component, OnInit } from '@angular/core';
import { CarouselConfig } from 'ngx-bootstrap/carousel';


@Component({
  selector: 'app-homepageNoAuth',
  templateUrl: './homepageNoAuth.component.html',
  styleUrls: ['./homepageNoAuth.component.scss'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 5000, noPause: true, showIndicators: true } }
  ]
})
export class HomepageNoAuthComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
