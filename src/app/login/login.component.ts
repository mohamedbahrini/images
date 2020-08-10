import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  loading = false;
  error = '';
  login: Promise<any>;
  constructor(private authenticationService: AuthenticationService,
    private router: Router) { }

  ngOnInit() { }

  public authenticate() {
    this.loading = true;
    this.error = '';
    this.login = this.authenticationService.login(this.model.username, this.model.password);
    this.login.then(
      active => {
        if (this.loading === true) {
          this.loading = false;
          this.router.navigate(['/profile']);
        }
      },
    ).catch(error => {
      this.loading = false;
      this.error = 'username or password are incorrect';
      console.log(error);
    });
  }
}
