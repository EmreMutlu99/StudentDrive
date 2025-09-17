import { MenuItem } from './menu.model';

export const MENU: MenuItem[] = [
  {
    label: 'Main',
    isTitle: true
  },
  {
    label: 'Dashboard',
    icon: 'home',
    link: '/dashboard'
  },
  {
    label: 'Web Apps',
    isTitle: true
  },
  {
    label: 'Email',
    icon: 'mail',
    subItems: [
      {
        label: 'Inbox',
        link: '/apps/email/inbox',
      },
      {
        label: 'Read',
        link: '/apps/email/read'
      },
      {
        label: 'Compose',
        link: '/apps/email/compose'
      },
    ]
  },
  {
    label: 'Chat',
    icon: 'message-square',
    link: '/apps/chat',
  },
  {
    label: 'Calendar',
    icon: 'calendar',
    link: '/apps/calendar',
    badge: {
      variant: 'primary',
      text: 'Event',
    }
  },
  {
    label: 'Components',
    isTitle: true
  },
  {
    label: 'UI Kit',
    icon: 'feather',
    subItems: [
      {
        label: 'Accordion',
        link: '/ui-components/accordion',
      },
      {
        label: 'Alerts',
        link: '/ui-components/alerts',
      },
      {
        label: 'Badges',
        link: '/ui-components/badges',
      },
      {
        label: 'Breadcrumbs',
        link: '/ui-components/breadcrumbs',
      },
      {
        label: 'Buttons',
        link: '/ui-components/buttons',
      },
      {
        label: 'Button group',
        link: '/ui-components/button-group',
      },
      {
        label: 'Cards',
        link: '/ui-components/cards',
      },
      {
        label: 'Carousel',
        link: '/ui-components/carousel',
      },
      {
        label: 'Collapse',
        link: '/ui-components/collapse',
      },
      {
        label: 'Datepicker',
        link: '/ui-components/datepicker',
      },
      {
        label: 'Dropdowns',
        link: '/ui-components/dropdowns',
      },
      {
        label: 'List group',
        link: '/ui-components/list-group',
      },
      {
        label: 'Media object',
        link: '/ui-components/media-object',
      },
      {
        label: 'Modal',
        link: '/ui-components/modal',
      },
      {
        label: 'Navs',
        link: '/ui-components/navs',
      },
      {
        label: 'Offcanvas',
        link: '/ui-components/offcanvas',
      },
      {
        label: 'Pagination',
        link: '/ui-components/pagination',
      },
      {
        label: 'Popovers',
        link: '/ui-components/popovers',
      },
      {
        label: 'Progress',
        link: '/ui-components/progress',
      },
      {
        label: 'Rating',
        link: '/ui-components/rating',
      },
      {
        label: 'Scrollbar',
        link: '/ui-components/scrollbar',
      },
      {
        label: 'Spinners',
        link: '/ui-components/spinners',
      },
      {
        label: 'Table',
        link: '/ui-components/table',
      },
      {
        label: 'Timepicker',
        link: '/ui-components/timepicker',
      },
      {
        label: 'Tooltips',
        link: '/ui-components/tooltips',
      },
      {
        label: 'Typeadhed',
        link: '/ui-components/typeahead',
      },
    ]
  },
  {
    label: 'Advanced UI',
    icon: 'anchor',
    subItems: [
      {
        label: 'Cropper',
        link: '/advanced-ui/cropper',
      },
      {
        label: 'Owl carousel',
        link: '/advanced-ui/owl-carousel',
      },
      {
        label: 'SortableJs',
        link: '/advanced-ui/sortablejs',
      },
      {
        label: 'Sweet alert',
        link: '/advanced-ui/sweet-alert',
      },
    ]
  },
  {
    label: 'Forms',
    icon: 'file-text',
    subItems: [
      {
        label: 'Basic elements',
        link: '/forms/basic-elements'
      },
      {
        label: 'Advanced elements',
        subItems: [
          {
            label: 'Ngx-custom-validators',
            link: '/forms/advanced/ngx-custom-validators'
          },
          {
            label: 'Ngx-mask',
            link: '/forms/advanced/ngx-mask'
          },
          {
            label: 'Ng-select',
            link: '/forms/advanced/ng-select'
          },
          {
            label: 'Ngx-chips',
            link: '/forms/advanced/ngx-chips'
          },
          {
            label: 'Ngx-color-picker',
            link: '/forms/advanced/ngx-color-picker'
          },
          {
            label: 'Ngx-dropzone',
            link: '/forms/advanced/ngx-dropzone-wrapper'
          },
        ]
      },
      {
        label: 'Editors',
        link: '/forms/editors'
      },
      {
        label: 'Wizard',
        link: '/forms/wizard'
      },
    ]
  },
  {
    label: 'Charts',
    icon: 'pie-chart',
    subItems: [
      {
        label: 'ApexCharts',
        link: '/charts/apexcharts',
      },
      {
        label: 'ChartJs',
        link: '/charts/chartjs',
      },
    ]
  },
  {
    label: 'Tables',
    icon: 'layout',
    subItems: [
      {
        label: 'Basic tables',
        link: '/tables/basic-tables',
      },
      {
        label: 'Ngx-datatable',
        link: '/tables/ngx-datatable'
      }
    ]
  },
  {
    label: 'Icons',
    icon: 'smile',
    subItems: [
      {
        label: 'Feather icons',
        link: '/icons/feather-icons',
      },
    ]
  },
  {
    label: 'Pages',
    isTitle: true
  },
  {
    label: 'Special pages',
    icon: 'book',
    subItems: [
      {
        label: 'Blank page',
        link: '/general/blank-page',
      },
      {
        label: 'Faq',
        link: '/general/faq',
      },
      {
        label: 'Invoice',
        link: '/general/invoice',
      },
      {
        label: 'Profile',
        link: '/general/profile',
      },
      {
        label: 'Pricing',
        link: '/general/pricing',
      },
      {
        label: 'Timeline',
        link: '/general/timeline',
      }
    ]
  },
  {
    label: 'Authentication',
    icon: 'unlock',
    subItems: [
      {
        label: 'Login',
        link: '/auth/login',
      },
      {
        label: 'Register',
        link: '/auth/register',
      },
    ]
  },
  {
    label: 'Error',
    icon: 'cloud-off',
    subItems: [
      {
        label: '404',
        link: '/error/404',
      },
      {
        label: '500',
        link: '/error/500',
      },
    ]
  },
];
