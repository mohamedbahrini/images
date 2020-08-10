import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  private data: Observable<Array<number>>;
  constructor(private authenticationService: AuthenticationService,
            private router: Router) { }

  ngOnInit() {
    this.authenticationService.logout();
    console.log('$$$$$ logout');
    setTimeout(() => {
        console.log('$$$$$ redirect from logout');
        this.router.navigate(['/login']);
    },
    1500);
  }
}
