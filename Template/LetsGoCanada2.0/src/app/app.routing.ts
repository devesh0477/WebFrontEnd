import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { AuthGuardService } from './services/auth-guard.service';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';

export const AppRoutes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AuthLayoutComponent,
        children: [{
            path: '',
            loadChildren: './pages/pages.module#PagesModule'
        }]
    },
    {
        path: '',
        component: AdminLayoutComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            },
            // {
            //     path: '',
            //     loadChildren: './dashboard/dashboard.module#DashboardModule',
            //     canActivate: [AuthGuardService],
            // },
            {
                path: '',
                loadChildren: './agents/agents.module#AgentsModule',
                canActivate: [AuthGuardService],
            },
            {
                path: '',
                loadChildren: './admin/admin.module#AdminModule',
                canActivate: [AuthGuardService],
            },
            {
                path: 'components',
                loadChildren: './components/components.module#ComponentsModule',
            }, {
                path: 'forms',
                loadChildren: './forms/forms.module#Forms'
            }, {
                path: 'tables',
                loadChildren: './tables/tables.module#TablesModule'
            }, {
                path: 'maps',
                loadChildren: './maps/maps.module#MapsModule'
            }, {
                path: 'widgets',
                loadChildren: './widgets/widgets.module#WidgetsModule'
            }, {
                path: 'charts',
                loadChildren: './charts/charts.module#ChartsModule'
            }, {
                path: 'calendar',
                loadChildren: './calendar/calendar.module#CalendarModule'
            }, {
                path: '',
                loadChildren: './userpage/user.module#UserModule'
            }, {
                path: '',
                loadChildren: './timeline/timeline.module#TimelineModule'
            },
            {
                path: '**',
                component: PageNotFoundComponent,
            },

        ]
    }
];
