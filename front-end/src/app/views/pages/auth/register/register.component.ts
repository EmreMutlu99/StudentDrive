import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { HttpClient } from '@angular/common/http';

type University = { id: string; name: string };
type Faculty = { id: string; name: string };

// Local seed data (used as fallback if API fails)
const SEED_UNIS: University[] = [
  { id: 'rwth', name: 'RWTH Aachen University' },
  { id: 'tum',  name: 'Technical University of Munich (TUM)' },
  { id: 'boğ',  name: 'Boğaziçi University' },
  { id: 'upb',  name: 'University of Paderborn' }
];

type SeedFaculty = { id: string; name: string; universityId: string };
const SEED_FACULTIES: SeedFaculty[] = [
  // RWTH
  { id: 'rwth-eecs', name: 'Electrical Engineering & Info Tech', universityId: 'rwth' },
  { id: 'rwth-me',   name: 'Mechanical Engineering',            universityId: 'rwth' },
  { id: 'rwth-cs',   name: 'Computer Science',                  universityId: 'rwth' },

  // TUM
  { id: 'tum-in',    name: 'Informatics',                       universityId: 'tum' },
  { id: 'tum-ei',    name: 'Electrical & Computer Engineering', universityId: 'tum' },
  { id: 'tum-ma',    name: 'Mathematics',                       universityId: 'tum' },

  // Boğaziçi
  { id: 'bog-cmp',   name: 'Computer Engineering',              universityId: 'boğ' },
  { id: 'bog-ee',    name: 'Electrical & Electronics',          universityId: 'boğ' },
  { id: 'bog-ie',    name: 'Industrial Engineering',            universityId: 'boğ' },

  // UPB
  { id: 'upb-cs',    name: 'Computer Science',                  universityId: 'upb' },
  { id: 'upb-me',    name: 'Mechanical Engineering',            universityId: 'upb' },
  { id: 'upb-ee',    name: 'Electrical Engineering',            universityId: 'upb' },
];

function passwordMatch(group: AbstractControl): ValidationErrors | null {
  const pwd = group.get('password')?.value;
  const cfm = group.get('confirmPassword')?.value;
  return pwd && cfm && pwd !== cfm ? { passwordMismatch: true } : null;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  // If you proxy /api to 3000, set API_BASE = '' and keep URLs starting with /api
  API_BASE = 'http://localhost:3000';

  step = 1;                // 1 = Account, 2 = Academic, 3 = Review
  readonly totalSteps = 3; // used for progress percentage

  loading = false;
  serverError = '';

  universities: University[] = [];
  faculties: Faculty[] = [];          // filtered list for current university
  private allSeedFaculties = SEED_FACULTIES;

  currentYear = new Date().getFullYear();

  // Whitelist of valid faculties for current university (used by validator)
  allowedFacultyIds = new Set<string>();

  // --- Form ---
  form = this.fb.group({
    account: this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      passwordGroup: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      }, { validators: passwordMatch })
    }),

    academic: this.fb.group({
      universityId: ['', Validators.required],
      facultyId: ['', [Validators.required, (control: AbstractControl) => this.facultyMatchesUniversity(control)]],
      semesterType: ['WS', Validators.required],  // 'WS' or 'SS'
      startYear: [this.currentYear, [Validators.required, Validators.min(2000), Validators.max(this.currentYear + 2)]],
    }),

    profile: this.fb.group({
      acceptTos: [false, Validators.requiredTrue]
    })
  });

  // --- getters used by template ---
  get account(): FormGroup { return this.form.get('account') as FormGroup; }
  get academic(): FormGroup { return this.form.get('academic') as FormGroup; }
  get profile(): FormGroup  { return this.form.get('profile')  as FormGroup; }

  get username() { return this.account.get('username')!; }
  get email()    { return this.account.get('email')!; }
  get pwdGroup() { return this.account.get('passwordGroup') as FormGroup; }
  get password() { return this.pwdGroup.get('password')!; }
  get confirm()  { return this.pwdGroup.get('confirmPassword')!; }

  /** Progress % for the top progress bar (step 1 -> 0%, step 2 -> 50%, step 3 -> 100%) */
  get progressPct(): number {
    const pct = ((this.step - 1) / (this.totalSteps - 1)) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  /** (Optional) helpers if you want to “paint” the stepper connectors too */
  get connector12Active(): boolean { return this.step >= 2; }
  get connector23Active(): boolean { return this.step >= 3; }

  // --- Custom validator for coordinated faculty/university ---
  facultyMatchesUniversity(control: AbstractControl): ValidationErrors | null {
    const v = control.value as string;
    if (!v) return null; // let `required` handle empty
    return this.allowedFacultyIds.has(String(v)) ? null : { facultyMismatch: true };
  }

  ngOnInit(): void {
    this.loadUniversities();

    // when university changes, clear & load faculties
    this.academic.get('universityId')!.valueChanges.subscribe((val) => {
      this.academic.get('facultyId')!.reset('');
      this.allowedFacultyIds.clear();
      if (val) this.loadFaculties(String(val));
      else this.faculties = [];
    });
  }

  // ---------- Data Loading (API with seed fallback) ----------
  private async loadUniversities() {
    try {
      const data = await this.http.get<University[]>(`${this.API_BASE}/api/meta/universities`).toPromise();
      this.universities = (data && data.length) ? data : SEED_UNIS;
    } catch {
      this.universities = SEED_UNIS;
    }
  }

  private async loadFaculties(universityId: string) {
    try {
      const data = await this.http.get<Faculty[]>(
        `${this.API_BASE}/api/meta/faculties`,
        { params: { universityId } }
      ).toPromise();

      if (data && data.length) {
        // API returned filtered list already
        this.faculties = data;
      } else {
        // fallback to local seed filtering
        this.faculties = this.fromSeed(universityId);
      }
    } catch {
      this.faculties = this.fromSeed(universityId);
    }

    // rebuild whitelist for validator and trigger revalidation
    this.allowedFacultyIds = new Set(this.faculties.map(f => String(f.id)));
    this.academic.get('facultyId')!.updateValueAndValidity();
  }

  private fromSeed(universityId: string): Faculty[] {
    return this.allSeedFaculties
      .filter(f => f.universityId === universityId)
      .map<Faculty>(f => ({ id: f.id, name: f.name }));
  }

  // ---------- Helpers ----------
  getUniversityName(id: string | null | undefined): string {
    if (!id) return '—';
    const u = this.universities.find(x => x.id === id);
    return u?.name ?? '—';
  }

  getFacultyName(id: string | null | undefined): string {
    if (!id) return '—';
    const f = this.faculties.find(x => x.id === id);
    return f?.name ?? '—';
  }

  private composeStartSemester(type: 'WS' | 'SS', year: number): string {
    if (type === 'WS') {
      const yy = ((year + 1) % 100).toString().padStart(2, '0');
      return `WS${year}/${yy}`;
    }
    return `SS${year}`;
  }

  // ---------- Navigation ----------
  next(): void {
    this.serverError = '';
    if (this.step === 1 && this.account.invalid) { this.account.markAllAsTouched(); return; }
    if (this.step === 2 && this.academic.invalid) { this.academic.markAllAsTouched(); return; }
    this.step = Math.min(this.totalSteps, this.step + 1);
  }

  back(): void {
    this.serverError = '';
    this.step = Math.max(1, this.step - 1);
  }

  // ---------- Submit ----------
  async submit(): Promise<void> {
    this.serverError = '';
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }

    // Defensive guard: ensure selected faculty is valid for current university
    const aca = this.academic.value as any;
    if (!this.allowedFacultyIds.has(String(aca.facultyId))) {
      this.academic.get('facultyId')!.setErrors({ facultyMismatch: true });
      this.academic.markAllAsTouched();
      return;
    }

    this.loading = true;

    const acc = this.account.value as any;
    const startSemester = this.composeStartSemester(aca.semesterType, Number(aca.startYear));

    const payload = {
      email: String(acc.email || '').trim(),
      password: acc.passwordGroup?.password,
      username: String(acc.username || '').trim(),
      startSemester,
      universityId: aca.universityId,
      facultyId: aca.facultyId
    };

    try {
      await this.http.post(`${this.API_BASE}/api/auth/register`, payload).toPromise();
      this.router.navigate(['/auth/login'], { queryParams: { registered: '1' } });
    } catch (err: any) {
      this.serverError = err?.error?.error || 'Registration failed';
    } finally {
      this.loading = false;
    }
  }
}
