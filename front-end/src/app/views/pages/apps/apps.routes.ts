import { Routes } from "@angular/router";

export default [
    { path: '', redirectTo: 'calendar', pathMatch: 'full' },
    {
        path: 'email',
        loadComponent: () => import('./email/email.component').then(c => c.EmailComponent),
        children: [
            { path: '', redirectTo: 'inbox', pathMatch: 'full' },
            {
                path: 'inbox',
                loadComponent: () => import('./email/inbox/inbox.component').then(c => c.InboxComponent)
            },
            {
                path: 'read',
                loadComponent: () => import('./email/read/read.component').then(c => c.ReadComponent)
            },
            {
                path: 'compose',
                loadComponent: () => import('./email/compose/compose.component').then(c => c.ComposeComponent)
            }
        ]
    },
    {
        path: 'chat',
        loadComponent: () => import('./chat/chat.component').then(c => c.ChatComponent) 
    },
    {
        path: 'calendar',
        loadComponent: () => import('./calendar/calendar.component').then(c => c.CalendarComponent)
    }
] as Routes;