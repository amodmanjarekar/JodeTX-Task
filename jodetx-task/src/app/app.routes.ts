import { Routes } from '@angular/router';
import { Home } from './home/home';
import { AuthPage } from './auth-page/auth-page';

export const routes: Routes = [
    {
        path: '',
        component: Home
    },
    {
        path: 'auth',
        component: AuthPage
    },
];

