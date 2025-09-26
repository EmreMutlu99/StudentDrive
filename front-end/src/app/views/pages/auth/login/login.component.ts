import { NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { GoogleButtonComponent } from './google-login/google-login.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    NgStyle,
    RouterLink,
    GoogleButtonComponent
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

  returnUrl: any;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Get the return URL from the route parameters, or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onLoggedin(e: Event) {
    e.preventDefault();
    localStorage.setItem('isLoggedin', 'true');
    if (localStorage.getItem('isLoggedin') === 'true') {
      this.router.navigate([this.returnUrl]);
    }
  }

}
