import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { ThemeModeService } from '../../../core/services/theme-mode.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgbDropdownModule,
    RouterLink
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit {

  currentTheme: string;

  constructor(private router: Router, private themeModeService: ThemeModeService) {}

  ngOnInit(): void {
    this.themeModeService.currentTheme.subscribe( (theme) => {
      this.currentTheme = theme;
      this.showActiveTheme(this.currentTheme);
    });
  }

  showActiveTheme(theme: string) {
    const themeSwitcher = document.querySelector('#theme-switcher') as HTMLInputElement;
    const box = document.querySelector('.box') as HTMLElement;

    if (!themeSwitcher) {
      return;
    }

    // Toggle the custom checkbox based on the theme
    if (theme === 'dark') {
      themeSwitcher.checked = true;
      box.classList.remove('light');
      box.classList.add('dark');
    } else if (theme === 'light') {
      themeSwitcher.checked = false;
      box.classList.remove('dark');
      box.classList.add('light');
    }
  }

  /**
   * Change the theme on #theme-switcher checkbox changes 
   */
  onThemeCheckboxChange(e: Event) {
    const checkbox = e.target as HTMLInputElement;
    const newTheme: string = checkbox.checked ? 'dark' : 'light';
    this.themeModeService.toggleTheme(newTheme);
    this.showActiveTheme(newTheme);
  }

  /**
   * Toggle the sidebar when the hamburger button is clicked
   */
  toggleSidebar(e: Event) {
    e.preventDefault();
    document.body.classList.add('sidebar-open');
    document.querySelector('.sidebar .sidebar-toggler')?.classList.add('active');
  }

  /**
   * Logout
   */
  onLogout(e: Event) {
    e.preventDefault();

    localStorage.setItem('isLoggedin', 'false');
    if (localStorage.getItem('isLoggedin') === 'false') {
      this.router.navigate(['/auth/login']);
    }
  }

}
