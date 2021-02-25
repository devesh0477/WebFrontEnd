import { Component } from '@angular/core';
import { Routes } from "@angular/router";
import { SchoolportalComponent } from "./schoolportal/schoolportal.component";
import { SchoolprogramsComponent } from "./schoolprograms/schoolprograms.component";
import { ProgramspertermComponent } from "./programsperterm/programsperterm.component";
import { AuthGuardService } from "../services/auth-guard.service";
import { PageNotFoundComponent } from "../page-not-found/page-not-found.component";
import { AgentManagementComponent } from "./agent-management/agent-management.component";
import { BranchManagementComponent } from "./branch-management/branch-management.component";
import { UserpasswordComponent } from "./userpassword/userpassword.component";
import { AgencyManagementComponent } from "./agency-management/agency-management.component";
import { LocalsComponent } from "./locals/locals.component";
import { UserProfileComponent } from "./user-profile/user-profile.component";
import { ApplicationComponent } from "./application/application.component";
import { SchoolComponent } from "./school/school.component";
import { MenuComponent } from "./user-profile/menu/menu.component";
import { AgencyEditComponent } from "./agency-management/agency-edit/agency-edit.component";
import { UsersComponent } from "./user-profile/users/users.component";
import { SubMenuComponent } from "./user-profile/sub-menu/sub-menu.component";
import { TermComponent } from "./school/term/term.component";
import { TypeOfSchoolComponent } from "./school/type-of-school/type-of-school.component";
import { TypeOfProgramComponent } from "./school/type-of-program/type-of-program.component";
import { DisciplineComponent } from "./school/discipline/discipline.component";
import { CityComponent } from "./locals/city/city.component";
import { ProvinceComponent } from "./locals/province/province.component";
import { CountryComponent } from "./locals/country/country.component";
import { LanguageComponent } from "./locals/language/language.component";
import { RoleMenuComponent } from "./user-profile/role-menu/role-menu.component";
import { InternalStatusComponent } from "./application/internal-status/internal-status.component";
import { InternalStatusWorkflowComponent } from "./application/internal-status-workflow/internal-status-workflow.component";
import { EducationTypeComponent } from "./application/education-type/education-type.component";
import { StatusComponent } from "./application/status/status.component";
import { PaymentProcessComponent } from "./payment-process/payment-process.component";
import { PaymentConceptsComponent } from "./payment-process/payment-concepts/payment-concepts.component";
import { DashboardComponent } from "./payment/dashboard/dashboard.component";
import { PaymentComponent } from "./payment/payment.component";
import { PaymentGatewayComponent } from "./payment-process/payment-gateway/payment-gateway.component";
import { PaymentStateComponent } from './payment-process/payment-state/payment-state.component';
import { PaymentWorkflowComponent } from './payment-process/payment-workflow/payment-workflow.component';
import { PaymentHistoryComponent } from "./payment-process/payment-history/payment-history.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CampusComponent } from './schoolportal/campus/campus.component';
import { CampusProgramComponent } from './schoolportal/campus/campus-program/campus-program.component';
import { PaymentCsvComponent } from './payment-process/payment-csv/payment-csv.component';
import { BannedCountryComponent } from './locals/banned-country/banned-country.component';
import { EmailsComponent } from './emails/emails.component';
import { LgcManagementComponent } from './lgc-management/lgc-management.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TermsPerRoleComponent } from './terms-and-conditions/terms-per-role/terms-per-role.component';
import { AgreedTermsAndConditionsComponent } from './terms-and-conditions/agreed-terms-and-conditions/agreed-terms-and-conditions.component';


export const AdminRoutes: Routes = [

    {
        path: '',
        children: [{
            path: 'school',
            component: SchoolportalComponent,
            // canActivate: [AuthGuardService]
        },
        {
            path: 'school-programs/:id/:schoolName',
            component: SchoolprogramsComponent,
            // canActivate: [AuthGuardService]
        },
        {
            path: 'school-programs:id:schoolName',
            component: SchoolprogramsComponent,
            // canActivate: [AuthGuardService]
        },
        {
            path: 'school-programs',
            component: SchoolprogramsComponent,
            // canActivate: [AuthGuardService]
        },
        {
            path: 'programs-term',
            component: ProgramspertermComponent,
            // canActivate: [AuthGuardService]
        },
        {
            path: 'agents',
            component: AgentManagementComponent,
        },
        {
            path: 'branchProfile',
            component: BranchManagementComponent,
        },
        {
            path: 'userPassword',
            component: UserpasswordComponent
        },
        {
            path: 'agencies',
            component: AgencyManagementComponent,
        },
        {
            path: 'lgc',
            component: LgcManagementComponent,
        },
        {
            path: 'termsandconditions',
            component: TermsAndConditionsComponent,
        },
        {
            path: 'agency-edit/:id',
            component: AgencyEditComponent,
        },
        {
            path: 'system-locals',
            component: LocalsComponent,
        },
        {
            path: 'system-school',
            component: SchoolComponent,
        },
        {
            path: 'system-application',
            component: ApplicationComponent,
        },
        {
            path: 'system-user-profile',
            component: UserProfileComponent,
        },
        {
            path: 'menu',
            component: MenuComponent
        },
        {
            path: 'users',
            component: UsersComponent
        },
        {
            path: 'sub-menu',
            component: SubMenuComponent
        },
        {
            path: 'terms',
            component: TermComponent
        },
        {
            path: 'type-of-school',
            component: TypeOfSchoolComponent
        },
        {
            path: 'type-of-program',
            component: TypeOfProgramComponent
        },
        {
            path: 'discipline',
            component: DisciplineComponent
        },
        {
            path: 'cities',
            component: CityComponent
        },
        {
            path: 'provinces',
            component: ProvinceComponent
        },
        {
            path: 'countries',
            component: CountryComponent
        },
        {
            path: 'banned-countries',
            component: BannedCountryComponent
        },
        {
            path: 'languages',
            component: LanguageComponent
        },
        {
            path: 'authorization',
            component: RoleMenuComponent
        },
        {
            path: 'internal-status',
            component: InternalStatusComponent
        },
        {
            path: 'int-status-work',
            component: InternalStatusWorkflowComponent
        },
        {
            path: 'education-type',
            component: EducationTypeComponent
        },
        {
            path: 'status',
            component: StatusComponent
        },
        {
            path: 'payment-process',
            component: PaymentProcessComponent
        },
        {
            path: 'payment-concepts',
            component: PaymentConceptsComponent
        },
        {
            path: 'payment-dashboard',
            component: PaymentComponent
        },
        {
            path: 'payment-gateway',
            component: PaymentGatewayComponent
        },
        {
            path: 'payment-states',
            component: PaymentStateComponent
        },
        {
            path: 'payment-workflow',
            component: PaymentWorkflowComponent
        },
        {
            path: 'payment-history',
            component: PaymentHistoryComponent
        },
        {
            path: 'reset-password',
            component: ResetPasswordComponent
        },
        {
            path: 'campus-admin/:id',
            component: CampusComponent
        },
        {
            path: 'campus-program/:id',
            component: CampusProgramComponent
        },
        {
            path: 'payment-csv',
            component: PaymentCsvComponent
        },
        {
            path: 'admin-email',
            component: EmailsComponent
        },
        {
            path: 'term-role',
            component: TermsPerRoleComponent
        },
        {
            path: 'agreedtermsandconditions',
            component: AgreedTermsAndConditionsComponent
        }
            // {
            //     path: '**',
            //     component: PageNotFoundComponent,
            //     // canActivate: [AuthGuardService],
            // }
            // {
            //     path: 'agent',
            //     component: SearchComponent
            // },
            // {
            //     path: 'school/:url',
            //     component: SchoolComponent
            // },
        ]
    }
];