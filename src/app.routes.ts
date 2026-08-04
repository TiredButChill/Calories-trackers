import { Routes } from '@angular/router';
import { authGuard, guestGuard } from '@/core/guards/auth.guard';

export const appRoutes: Routes = [
    {
        path: 'login',
        canActivate: [guestGuard],
        loadComponent: () => import('@/features/auth/login').then((c) => c.Login)
    },
    {
        path: '',
        canActivate: [authGuard],
        loadComponent: () => import('@/shared/components/app-shell').then((c) => c.AppShell),
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', loadComponent: () => import('@/features/dashboard/dashboard').then((c) => c.Dashboard) },
            { path: 'foods', loadComponent: () => import('@/features/foods/foods').then((c) => c.Foods) },
            { path: 'log', loadComponent: () => import('@/features/daily-log/daily-log').then((c) => c.DailyLog) },
            { path: 'goals', loadComponent: () => import('@/features/goals/goals').then((c) => c.Goals) },
            { path: 'weight', loadComponent: () => import('@/features/weight/weight').then((c) => c.Weight) }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
