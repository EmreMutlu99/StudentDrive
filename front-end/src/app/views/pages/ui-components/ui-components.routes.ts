import { Routes } from "@angular/router";

export default [
  { path: '', redirectTo: 'accordion', pathMatch: 'full' },
  {
    path: 'accordion',
    loadComponent: () => import('./accordion/accordion.component').then(c => c.AccordionComponent)
  },
  {
    path: 'alerts',
    loadComponent: () => import('./alerts/alerts.component').then(c => c.AlertsComponent)
  },
  {
    path: 'badges',
    loadComponent: () => import('./badges/badges.component').then(c => c.BadgesComponent)
  },
  {
    path: 'breadcrumbs',
    loadComponent: () => import('./breadcrumbs/breadcrumbs.component').then(c => c.BreadcrumbsComponent)
  },
  {
    path: 'buttons',
    loadComponent: () => import('./buttons/buttons.component').then(c => c.ButtonsComponent)
  },
  {
    path: 'button-group',
    loadComponent: () => import('./button-group/button-group.component').then(c => c.ButtonGroupComponent)
  },
  {
    path: 'cards',
    loadComponent: () => import('./cards/cards.component').then(c => c.CardsComponent)
  },
  {
    path: 'carousel',
    loadComponent: () => import('./carousel/carousel.component').then(c => c.CarouselComponent)
  },
  {
    path: 'collapse',
    loadComponent: () => import('./collapse/collapse.component').then(c => c.CollapseComponent)
  },
  {
    path: 'datepicker',
    loadComponent: () => import('./datepicker/datepicker.component').then(c => c.DatepickerComponent)
  },
  {
    path: 'dropdowns',
    loadComponent: () => import('./dropdowns/dropdowns.component').then(c => c.DropdownsComponent)
  },
  {
    path: 'list-group',
    loadComponent: () => import('./list-group/list-group.component').then(c => c.ListGroupComponent)
  },
  {
    path: 'media-object',
    loadComponent: () => import('./media-object/media-object.component').then(c => c.MediaObjectComponent)
  },
  {
    path: 'modal',
    loadComponent: () => import('./modal/modal.component').then(c => c.ModalComponent)
  },
  {
    path: 'navs',
    loadComponent: () => import('./navs/navs.component').then(c => c.NavsComponent)
  },
  {
    path: 'offcanvas',
    loadComponent: () => import('./offcanvas/offcanvas.component').then(c => c.OffcanvasComponent)
  },
  {
    path: 'pagination',
    loadComponent: () => import('./pagination/pagination.component').then(c => c.PaginationComponent)
  },
  {
    path: 'popovers',
    loadComponent: () => import('./popovers/popovers.component').then(c => c.PopoversComponent)
  },
  {
    path: 'progress',
    loadComponent: () => import('./progress/progress.component').then(c => c.ProgressComponent)
  },
  {
    path: 'rating',
    loadComponent: () => import('./rating/rating.component').then(c => c.RatingComponent)
  },
  {
    path: 'scrollbar',
    loadComponent: () => import('./scrollbar/scrollbar.component').then(c => c.ScrollbarComponent)
  },
  {
    path: 'spinners',
    loadComponent: () => import('./spinners/spinners.component').then(c => c.SpinnersComponent)
  },
  {
    path: 'table',
    loadComponent: () => import('./table/table.component').then(c => c.TableComponent)
  },
  {
    path: 'timepicker',
    loadComponent: () => import('./timepicker/timepicker.component').then(c => c.TimepickerComponent)
  },
  {
    path: 'tooltips',
    loadComponent: () => import('./tooltips/tooltips.component').then(c => c.TooltipsComponent)
  },
  {
    path: 'typeahead',
    loadComponent: () => import('./typeahead/typeahead.component').then(c => c.TypeaheadComponent)
  }
] as Routes;