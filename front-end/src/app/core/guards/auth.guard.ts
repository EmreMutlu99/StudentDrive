import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

const API_BASE = 'http://localhost:3000'; // adjust if you use environments

/** Avoid open redirects; only allow internal absolute paths */
function sanitizeReturnUrl(url: string): string {
  try {
    const u = (url || '').split('?')[0]; // strip query for safety
    if (/^https?:\/\//i.test(u)) return '/dashboard';
    if (!u.startsWith('/')) return '/dashboard';
    // optionally allow-list only your app areas:
    // if (!/^\/(dashboard|apps|forms|charts|tables|icons|general)(\/|$)/.test(u)) return '/dashboard';
    return u || '/dashboard';
  } catch {
    return '/dashboard';
  }
}

/**
 * Auth guard for the private app shell.
 * - If /api/auth/me succeeds -> allow
 * - If it fails (401/403) -> redirect to /landing with ?returnUrl=<intended>
 */
export const authGuard: CanActivateChildFn = (
  _route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): UrlTree | boolean | any => {
  const http = inject(HttpClient);
  const router = inject(Router);

  return http.get(`${API_BASE}/api/auth/me`, { withCredentials: true }).pipe(
    map(() => true),
    catchError(() => {
      const returnUrl = sanitizeReturnUrl(state.url);
      return of(
        router.createUrlTree(['/landing'], {
          queryParams: { returnUrl },
        })
      );
    })
  );
};
