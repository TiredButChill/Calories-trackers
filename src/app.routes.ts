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
            { path: 'weight', loadComponent: () => import('@/features/weight/weight').then((c) => c.Weight) },
            {
                path: 'workout',
                loadComponent: () => import('@/features/workout/workout-shell').then((c) => c.WorkoutShell),
                children: [
                    { path: '', redirectTo: 'today', pathMatch: 'full' },
                    { path: 'today', loadComponent: () => import('@/features/workout/today/workout-today').then((c) => c.WorkoutToday) },
                    { path: 'schedule', loadComponent: () => import('@/features/workout/schedule/workout-schedule').then((c) => c.WorkoutSchedule) },
                    { path: 'templates', loadComponent: () => import('@/features/workout/templates/workout-templates').then((c) => c.WorkoutTemplates) },
                    {
                        path: 'templates/:id',
                        loadComponent: () => import('@/features/workout/templates/workout-template-detail').then((c) => c.WorkoutTemplateDetail)
                    },
                    { path: 'exercises', loadComponent: () => import('@/features/workout/exercises/exercise-library').then((c) => c.ExerciseLibrary) },
                    { path: 'history', loadComponent: () => import('@/features/workout/history/workout-history').then((c) => c.WorkoutHistory) },
                    {
                        path: 'history/:date',
                        loadComponent: () => import('@/features/workout/history/workout-history-detail').then((c) => c.WorkoutHistoryDetail)
                    },
                    { path: 'progress', loadComponent: () => import('@/features/workout/progress/workout-progress').then((c) => c.WorkoutProgress) },
                    { path: 'calendar', loadComponent: () => import('@/features/workout/calendar/workout-calendar').then((c) => c.WorkoutCalendar) }
                ]
            }
        ]
    },
    { path: '**', redirectTo: 'dashboard' }
];
