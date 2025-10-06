import { NgIf, NgStyle } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { GoogleButtonComponent } from './google-login/google-login.component';
import { AuthService } from '../../../../core/services/auth.service'; // adjust path

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [NgIf, NgStyle, RouterLink, FormsModule, GoogleButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  // ---- config ----
  readonly API_BASE = 'http://localhost:3000'; // adjust per environment

  // ---- UI state ----
  email = '';
  password = '';
  rememberMe = false;
  loading = false;
  serverError = '';
  returnUrl = '/dashboard';

  // constructor(...)
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    // 1) Get returnUrl from query param, fallback to /dashboard, and sanitize
    const raw =
      this.route.snapshot.queryParamMap.get('returnUrl') || '/dashboard';
    this.returnUrl = this.sanitizeReturnUrl(raw);

    // 2) If already logged in, skip the form (nice UX)
    this.http
      .get(`${this.API_BASE}/api/auth/me`, { withCredentials: true })
      .subscribe({
        next: () => this.router.navigateByUrl(this.returnUrl),
        error: () => {
          /* not logged in → stay on page */
        },
      });
  }

  // Only allow internal, absolute paths (avoid open redirects)
  private sanitizeReturnUrl(url: string): string {
    try {
      // Reject full URLs (http/https)
      if (/^https?:\/\//i.test(url)) return '/dashboard';
      // Must start with a single slash (allow things like /dashboard?x=1#y)
      if (!url.startsWith('/')) return '/dashboard';
      // Optionally restrict to known prefixes:
      // if (!/^\/(dashboard|apps|forms|tables|icons|general)(\/|$)/.test(url)) return '/dashboard';
      return url;
    } catch {
      return '/dashboard';
    }
  }

  onSubmit(e: Event) {
    e.preventDefault();
    // ...validation...
    this.http.post<{ ok: boolean; user?: any }>(
      `${this.API_BASE}/api/auth/login`,
      { email: this.email, password: this.password },
      { withCredentials: true }
    ).subscribe({
      next: (resp) => {
        this.loading = false;
        if (resp?.ok && resp.user) {
          this.auth.setUser(resp.user);              // <-- cache user immediately
          if (this.rememberMe) localStorage.setItem('remember_me', '1');
          this.router.navigateByUrl(this.returnUrl);
        } else {
          this.serverError = 'Login failed';
        }
      },
      error: (err) => {
        this.loading = false;
        this.serverError = err?.error?.error || 'Login failed';
      }
    });
  }
  
}
