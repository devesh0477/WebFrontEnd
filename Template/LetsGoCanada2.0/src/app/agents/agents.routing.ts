import { Routes } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { SearchComponent } from './search/search.component';
import { SchoolComponent } from './search/school/school.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { ProgramDetailComponent } from './search/program-list/program-detail/program-detail.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AuthGuardService } from '../services/auth-guard.service';
import { ApplicationComponent } from '../admin/application/application.component';
import { CampusDetailsComponent } from './search/school/info/campus/campus-details/campus-details.component';
import { ProfiComponent } from './profi/profi.component';


export const AgentsRoutes: Routes = [

    {
        path: '',
        children: [
            {
                path: 'profile',
                component: ProfileComponent
            },
            {
                path: 'profile/:id',
                component: ProfileComponent
            },
            {
                path: 'search',
                component: SearchComponent
            },
            {
                path: 'school-detail/:id',
                component: SchoolComponent
            },
            {
                path: 'program/:id',
                component: ProgramDetailComponent
            },
            {
                path: 'applicants',
                component: ApplicantsComponent
            },
            {
                path: 'applications',
                component: ApplicationsComponent
            },
            {
                path: 'application-details/:id',
                component: ApplicationDetailsComponent
            },
            {
                path: 'campus/:id',
                component: CampusDetailsComponent
            },
            {
                path: 'profi',
                component: ProfiComponent
            },
            {
                path: 'profi/:id',
                component: ProfiComponent
            }
        ]
    }
];




