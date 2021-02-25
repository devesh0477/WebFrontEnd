import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { UnauthorizedComponent } from '../unauthorized/unauthorized.component';
import { ApplicantLoginComponent } from './applicantLogin/login.component';
import { ApplicantRegisterComponent } from './applicantRegister/register.component';
import { RecoveryComponent } from './recovery/recovery.component';

export const PagesRoutes: Routes = [
    {
        path: '',
        children: [{
            path: 'login',
            component: LoginComponent
        },
        {
            path: 'applicantLogin',
            component: ApplicantLoginComponent
        },
        {
            path: 'lock',
            component: LockComponent
        }, {
            path: 'register',
            component: RegisterComponent
        },
        {
            path: 'applicantRegister',
            component: ApplicantRegisterComponent
        },
        {
            path: '403',
            component: UnauthorizedComponent
        },
        {
            path: 'recovery',
            component: RecoveryComponent
        }
    ]
    }
];