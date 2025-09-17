import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'basic-elements', pathMatch: 'full' },
  {
    path: 'basic-elements',
    loadComponent: () => import('./basic-elements/basic-elements.component').then(c => c.BasicElementsComponent)
  },
  {
    path: 'advanced',
    children: [
      { path: '', redirectTo: 'ngx-custom-validators', pathMatch: 'full' },
      {
        path: 'ngx-custom-validators',
        loadComponent: () => import('./advanced/custom-validators/custom-validators.component').then(c => c.CustomValidatorsComponent)
      },
      {
        path: 'ngx-mask',
        loadComponent: () => import('./advanced/input-mask/input-mask.component').then(c => c.InputMaskComponent)
      },
      {
        path: 'ng-select',
        loadComponent: () => import('./advanced/ng-select/ng-select.component').then(c => c.NgSelectComponent)
      },
      {
        path: 'ngx-chips',
        loadComponent: () => import('./advanced/ngx-chips/ngx-chips.component').then(c => c.NgxChipsComponent)
      },
      {
        path: 'ngx-color-picker',
        loadComponent: () => import('./advanced/ngx-color-picker/ngx-color-picker.component').then(c => c.NgxColorPickerComponent)
      },
      {
        path: 'ngx-dropzone-wrapper',
        loadComponent: () => import('./advanced/ngx-dropzone-wrapper/ngx-dropzone-wrapper.component').then(c => c.NgxDropzoneWrapperComponent)
      }
    ]
  },
  {
    path: 'editors',
    loadComponent: () => import('./editors/editors.component').then(c => c.EditorsComponent)
  },
  {
    path: 'wizard',
    loadComponent: () => import('./wizard/wizard.component').then(c => c.WizardComponent)
  }
] as Routes;