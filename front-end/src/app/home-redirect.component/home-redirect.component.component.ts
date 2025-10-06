import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-home-redirect',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="d-flex justify-content-center align-items-center" style="min-height:40vh">
      <div>Loading…</div>
    </div>
  `,
})
export class HomeRedirectComponent {
  private readonly API_BASE = 'http://localhost:3000';

  constructor(private http: HttpClient, private router: Router) {
    this.http.get(`${this.API_BASE}/api/auth/me`, { withCredentials: true })
      .subscribe({
        next: () => this.router.navigateByUrl('/dashboard'),
        error: () => this.router.navigateByUrl('/landing'),
      });
  }
}
