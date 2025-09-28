import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // Adjust if you proxy API (e.g., /api)
  API_BASE = 'http://localhost:3000';

  loading = false;
  errorMsg = '';

  form = this.fb.group({
    username: ['',
      [Validators.minLength(3), Validators.maxLength(20), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]
    ],
    displayName: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    // Add these later if you want:
    // startSemester: [''],
    // universityId: [''],
    // facultyId: [''],
    remember: [false]
  });

  get f() { return this.form.controls; }

  async onSubmit() {
    this.errorMsg = '';
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading = true;

    const { email, password, username, displayName } = this.form.value;
    const payload: any = {
      email: (email ?? '').toString().trim(),
      password,
    };
    if (username) payload.username = username;
    if (displayName) payload.displayName = displayName;
    // Add optional fields when you add inputs:
    // if (this.form.value.startSemester) payload.startSemester = this.form.value.startSemester;
    // if (this.form.value.universityId) payload.universityId = this.form.value.universityId;
    // if (this.form.value.facultyId) payload.facultyId = this.form.value.facultyId;

    try {
      await this.http.post(`${this.API_BASE}/api/auth/register`, payload, {
        // register doesn’t need cookies; keep false (default)
        withCredentials: false
      }).toPromise();

      // success: send user to login (or auto-login)
      this.router.navigate(['/auth/login'], { queryParams: { registered: '1' } });
    } catch (err: any) {
      // Backend returns 409 for duplicate email/username
      this.errorMsg = err?.error?.error || 'Registration failed. Please try again.';
    } finally {
      this.loading = false;
    }
  }
}
