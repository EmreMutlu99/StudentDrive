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
type DegreeProgram = { id: string; name: string; degree?: string | null };

// Local seed data (fallback if API fails)
const SEED_UNIS: University[] = [
  { id: 'rwth', name: 'RWTH Aachen University' },
  { id: 'tum',  name: 'Technical University of Munich (TUM)' },
  { id: 'bog',  name: 'Boğaziçi University' },
  { id: 'upb',  name: 'University of Paderborn' }
];

type SeedProgram = { id: string; name: string; universityId: string };
const SEED_PROGRAMS: SeedProgram[] = [
  // RWTH (examples)
  { id: 'rwth-inf-bsc', name: 'Informatik B.Sc.', universityId: 'rwth' },
  { id: 'rwth-me-msc',  name: 'Maschinenbau M.Sc.', universityId: 'rwth' },

  // TUM (examples)
  { id: 'tum-in-bsc',   name: 'Informatics B.Sc.', universityId: 'tum' },
  { id: 'tum-ei-msc',   name: 'Electrical & Computer Engineering M.Sc.', universityId: 'tum' },
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

  API_BASE = 'http://localhost:3000';

  step = 1;
  readonly totalSteps = 3;

  loading = false;
  serverError = '';

  universities: University[] = [];
  programs: DegreeProgram[] = [];              // ← degree programs for selected university
  private seedPrograms = SEED_PROGRAMS;

  currentYear = new Date().getFullYear();

  // Whitelist of valid program IDs for validator
  allowedProgramIds = new Set<string>();

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
      degreeProgramId: ['', [Validators.required, (c: AbstractControl) => this.programMatchesUniversity(c)]],
      semesterType: ['WS', Validators.required],  // 'WS' | 'SS'
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

  /** Top progress bar % */
  get progressPct(): number {
    const pct = ((this.step - 1) / (this.totalSteps - 1)) * 100;
    return Math.max(0, Math.min(100, pct));
  }

  // --- Custom validator: selected program belongs to selected university ---
  programMatchesUniversity(control: AbstractControl): ValidationErrors | null {
    const v = control.value as string;
    if (!v) return null; // let `required` handle empty
    return this.allowedProgramIds.has(String(v)) ? null : { facultyMismatch: true }; // keep same key to reuse template messages
  }

  ngOnInit(): void {
    this.loadUniversities();

    // When university changes, clear & load programs
    this.academic.get('universityId')!.valueChanges.subscribe((val) => {
      this.academic.get('degreeProgramId')!.reset('');
      this.allowedProgramIds.clear();
      if (val) this.loadPrograms(String(val));
      else this.programs = [];
    });
  }

  // ---------- Data Loading (API with seed fallback) ----------
  private async loadUniversities() {
    try {
      const data = await this.http.get<University[]>(`${this.API_BASE}/api/universities`).toPromise();
      this.universities = (data && data.length) ? data : SEED_UNIS;
    } catch {
      this.universities = SEED_UNIS;
    }
  }

  private async loadPrograms(universityId: string) {
    try {
      const data = await this.http.get<DegreeProgram[]>(
        `${this.API_BASE}/api/degree-programs`,
        { params: { universityId } }
      ).toPromise();

      this.programs = (data && data.length) ? data : this.fromSeed(universityId);
    } catch {
      this.programs = this.fromSeed(universityId);
    }

    // rebuild whitelist for validator and trigger revalidation
    this.allowedProgramIds = new Set(this.programs.map(p => String(p.id)));
    this.academic.get('degreeProgramId')!.updateValueAndValidity();
  }

  private fromSeed(universityId: string): DegreeProgram[] {
    return this.seedPrograms
      .filter(p => p.universityId === universityId)
      .map<DegreeProgram>(p => ({ id: p.id, name: p.name }));
  }

  // ---------- Helpers ----------
  getUniversityName(id: string | null | undefined): string {
    if (!id) return '—';
    const u = this.universities.find(x => x.id === id);
    return u?.name ?? '—';
  }

  getProgramName(id: string | null | undefined): string {
    if (!id) return '—';
    const p = this.programs.find(x => x.id === id);
    return p ? (p.degree ? `${p.name} (${p.degree})` : p.name) : '—';
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

    const aca = this.academic.value as any;
    if (!this.allowedProgramIds.has(String(aca.degreeProgramId))) {
      this.academic.get('degreeProgramId')!.setErrors({ facultyMismatch: true });
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
      degreeProgramId: aca.degreeProgramId
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
