import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  {
    path: 'blank-page',
    loadComponent: () => import('./blank/blank.component').then(c => c.BlankComponent)
  },
  {
    path: 'faq',
    loadComponent: () => import('./faq/faq.component').then(c => c.FaqComponent)
  },
  {
    path: 'invoice',
    loadComponent: () => import('./invoice/invoice.component').then(c => c.InvoiceComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile.component').then(c => c.ProfileComponent)
  },
  {
    path: 'pricing',
    loadComponent: () => import('./pricing/pricing.component').then(c => c.PricingComponent)
  },
  {
    path: 'timeline',
    loadComponent: () => import('./timeline/timeline.component').then(c => c.TimelineComponent)
  }
] as Routes