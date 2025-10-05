import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  {
    path: 'landing',
    loadComponent: () =>
      import('./landing/landing.component').then(c => c.LandingComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./register/register.component').then(c => c.RegisterComponent)
  },
  {
    path: 'legal',
    children: [
      {
        path: 'terms',
        loadComponent: () =>
          import('./legal/terms/terms.component').then(c => c.TermsComponent),
      },
      {
        path: 'privacy',
        loadComponent: () =>
          import('./legal/privacy/privacy.component').then(c => c.PrivacyComponent),
      },
      { path: '', redirectTo: 'privacy', pathMatch: 'full' },
    ],
  },
] as Routes;