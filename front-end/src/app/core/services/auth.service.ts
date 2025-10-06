import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

export type CurrentUser = {
  id: string;
  email: string;
  username?: string | null;
  avatarUrl?: string | null;
  startSemester?: string | null;
  university?: { id: string; name: string } | null;
  degreeProgram?: { id: string; name: string; degree?: string | null } | null;
  createdAt?: string;
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_BASE = 'http://localhost:3000';

  /** null = unknown (not fetched yet), false = logged out, object = logged in */
  private userSubject = new BehaviorSubject<CurrentUser | null | false>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  /** Call once on app load or when a component needs user; cached afterwards */
  ensureSession(): Observable<boolean> {
    // Already resolved
    if (this.userSubject.value === false) return of(false);
    if (this.userSubject.value && this.userSubject.value !== null) return of(true);

    return this.http.get<CurrentUser>(`${this.API_BASE}/api/auth/me`, { withCredentials: true }).pipe(
      tap(user => this.userSubject.next(user)),
      map(() => true),
      catchError(() => {
        this.userSubject.next(false);
        return of(false);
      })
    );
  }

  /** Set user right after /login success to avoid an extra /me call */
  setUser(user: CurrentUser) {
    this.userSubject.next(user);
  }

  /** Clear on logout */
  clear() {
    this.userSubject.next(false);
  }
}
