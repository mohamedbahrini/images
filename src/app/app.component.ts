import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  navbar = false;
  constructor(private router: Router, private authenticationService: AuthenticationService) { }
  ngOnInit() {
    this.router.events.subscribe((val) => {
      this.navbar = this.authenticationService.isAuthenticated();
    });
  }
}
