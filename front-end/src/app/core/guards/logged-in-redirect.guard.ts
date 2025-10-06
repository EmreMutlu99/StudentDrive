import { inject } from '@angular/core';
import { CanMatchFn, Router, UrlTree } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

const API_BASE = 'http://localhost:3000'; // adjust if you use environments

/**
 * If the user is already logged in (cookie session valid), redirect them
 * away from /auth to /dashboard. Otherwise allow matching /auth routes.
 */
export const loggedInRedirectGuard: CanMatchFn = (): UrlTree | boolean | any => {
  const http = inject(HttpClient);
  const router = inject(Router);

  // IMPORTANT: withCredentials so the session cookie is sent
  return http.get(`${API_BASE}/api/auth/me`, { withCredentials: true }).pipe(
    map(() => router.createUrlTree(['/dashboard'])), // /me OK → already logged in
    catchError(() => of(true))                        // /me 401/403 → allow /auth
  );
};
