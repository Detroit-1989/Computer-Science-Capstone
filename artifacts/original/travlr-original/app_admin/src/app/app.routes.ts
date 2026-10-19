import { Routes } from '@angular/router';
import { Login } from './login/login';
import { TripList } from './trip-list/trip-list';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    {
        path: 'login',
        component: Login 
    },

    {
        path: '',
        component: TripList,
        canActivate: [authGuard]
    }
];
