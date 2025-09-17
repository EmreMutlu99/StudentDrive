import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'cropper', pathMatch: 'full' },
  {
    path: 'cropper',
    loadComponent: () => import('./cropper/cropper.component').then(c => c.CropperComponent)
  },
  {
    path: 'owl-carousel',
    loadComponent: () => import('./owl-carousel/owl-carousel.component').then(c => c.OwlCarouselComponent)
  },
  {
    path: 'sortablejs',
    loadComponent: () => import('./sortablejs/sortablejs.component').then(c => c.SortablejsComponent)
  },
  {
    path: 'sweet-alert',
    loadComponent: () => import('./sweet-alert/sweet-alert.component').then(c => c.SweetAlertComponent)
  }
] as Routes;