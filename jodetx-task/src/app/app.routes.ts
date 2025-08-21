import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AuthPage } from './auth-page/auth-page';
import { authGuard } from './auth-guard';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        // canActivate: [authGuard]
    },
    {
        path: 'auth',
        component: AuthPage
    },
];

