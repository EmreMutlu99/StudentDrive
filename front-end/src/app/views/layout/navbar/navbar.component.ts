import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModeService } from '../../../core/services/theme-mode.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [NgbDropdownModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {
  readonly API_BASE = 'http://localhost:3000'; // adjust per env
  currentTheme: string;

  constructor(
    private router: Router,
    private themeModeService: ThemeModeService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.themeModeService.currentTheme.subscribe(theme => {
      this.currentTheme = theme;
      this.showActiveTheme(this.currentTheme);
    });
  }

  showActiveTheme(theme: string) {
    const themeSwitcher = document.querySelector('#theme-switcher') as HTMLInputElement;
    const box = document.querySelector('.box') as HTMLElement;
    if (!themeSwitcher) return;

    if (theme === 'dark') {
      themeSwitcher.checked = true;
      box.classList.remove('light');
      box.classList.add('dark');
    } else {
      themeSwitcher.checked = false;
      box.classList.remove('dark');
      box.classList.add('light');
    }
  }

  onThemeCheckboxChange(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const newTheme = checkbox.checked ? 'dark' : 'light';
    this.themeModeService.toggleTheme(newTheme);
    this.showActiveTheme(newTheme);
  }

  toggleSidebar(e: Event) {
    e.preventDefault();
    document.body.classList.add('sidebar-open');
    document.querySelector('.sidebar .sidebar-toggler')?.classList.add('active');
  }

  /**
   * Secure logout: revoke server session + navigate to /landing
   */
  onLogout(e: Event) {
    e.preventDefault();

    this.http
      .post(`${this.API_BASE}/api/auth/logout`, {}, { withCredentials: true })
      .subscribe({
        next: () => this.finishLogout(),
        error: () => this.finishLogout(), // still go to landing if it fails
      });
  }

  private finishLogout() {
    // Clear any local flags your app may have set
    localStorage.removeItem('isLoggedin');
    localStorage.removeItem('remember_me');
    this.router.navigate(['/landing']);
  }
}
