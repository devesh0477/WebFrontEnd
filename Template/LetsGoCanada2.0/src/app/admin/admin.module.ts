import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminRoutes } from './admin.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule } from '../app.module';
import { SchoolportalComponent } from './schoolportal/schoolportal.component';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { NgxEditorModule } from 'ngx-editor';
import { SchoolprogramsComponent } from './schoolprograms/schoolprograms.component';
import { ProgramspertermComponent } from './programsperterm/programsperterm.component';
import { PaginationModule } from '../pagination/pagination.module';
import { NgxPaginationModule } from 'ngx-pagination';
import { AgentManagementComponent } from './agent-management/agent-management.component';
import { AgentEditComponent } from './agent-management/agent-edit/agent-edit.component';
import { AgentSearchComponent } from './agent-management/agent-search/agent-search.component';
import { BranchManagementComponent } from './branch-management/branch-management.component';
import { BranchEditComponent } from './branch-management/branch-edit/branch-edit.component';
import { BranchSearchComponent } from './branch-management/branch-search/branch-search.component';
import { UserpasswordComponent } from './userpassword/userpassword.component';
import { FieldErrorDisplayComponent } from './userpassword/field-error-display/field-error-display.component';
import { AgencyManagementComponent } from './agency-management/agency-management.component';
import { MenuListComponent } from './user-profile/menu/menu-list/menu-list.component';
import { LocalsComponent } from './locals/locals.component';
import { CountryComponent } from './locals/country/country.component';
import { ProvinceComponent } from './locals/province/province.component';
import { CityComponent } from './locals/city/city.component';
import { LanguageComponent } from './locals/language/language.component';
import { SchoolComponent } from './school/school.component';
import { TermComponent } from './school/term/term.component';
import { TypeOfSchoolComponent } from './school/type-of-school/type-of-school.component';
import { TypeOfProgramComponent } from './school/type-of-program/type-of-program.component';
import { DisciplineComponent } from './school/discipline/discipline.component';
import { ApplicationComponent } from './application/application.component';
import { InternalStatusComponent } from './application/internal-status/internal-status.component';
import { InternalStatusWorkflowComponent } from './application/internal-status-workflow/internal-status-workflow.component';
import { StatusComponent } from './application/status/status.component';
import { EducationTypeComponent } from './application/education-type/education-type.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MenuComponent } from './user-profile/menu/menu.component';
import { RoleMenuComponent } from './user-profile/role-menu/role-menu.component';
import { RoleComponent } from './user-profile/role/role.component';
import { AgencyEditComponent } from './agency-management/agency-edit/agency-edit.component';
import { UsersComponent } from './user-profile/users/users.component';
import { UsersListComponent } from './user-profile/users/users-list/users-list.component';
import { CountrySearchComponent } from './locals/country/country-search/country-search.component';
import { CountryEditComponent } from './locals/country/country-edit/country-edit.component';
import { ProvinceEditComponent } from './locals/province/province-edit/province-edit.component';
import { ProvinceSearchComponent } from './locals/province/province-search/province-search.component';
import { CitySearchComponent } from './locals/city/city-search/city-search.component';
import { CityEditComponent } from './locals/city/city-edit/city-edit.component';
import { LanguageEditComponent } from './locals/language/language-edit/language-edit.component';
import { LanguageSearchComponent } from './locals/language/language-search/language-search.component';
import { SubMenuComponent } from './user-profile/sub-menu/sub-menu.component';
import { SubMenuListComponent } from './user-profile/sub-menu/sub-menu-list/sub-menu-list.component';
import { RoleMenuListComponent } from './user-profile/role-menu/role-menu-list/role-menu-list.component';
import { EducationEditComponent } from './application/education-type/education-edit/education-edit.component';
import { EducationSearchComponent } from './application/education-type/education-search/education-search.component';
import { InternalStatusListComponent } from './application/internal-status/internal-status-list/internal-status-list.component';
import { IntStatusWorkflowListComponent } from './application/internal-status-workflow/int-status-workflow-list/int-status-workflow-list.component';
import { StatusEditComponent } from './application/status/status-edit/status-edit.component';
import { StatusSearchComponent } from './application/status/status-search/status-search.component';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { PaymentConceptsComponent } from './payment-process/payment-concepts/payment-concepts.component';
import { PaymentComponent } from './payment/payment.component';
import { DashboardComponent } from './payment/dashboard/dashboard.component';
import { PaymentGatewayComponent } from './payment-process/payment-gateway/payment-gateway.component';
import { RoleMenuSearchComponent } from './user-profile/role-menu/role-menu-search/role-menu-search.component';
import { PaymentStateComponent } from './payment-process/payment-state/payment-state.component';
import { StateEditComponent } from './payment-process/payment-state/state-edit/state-edit.component';
import { PaymentWorkflowComponent } from './payment-process/payment-workflow/payment-workflow.component';
import { PaymentHistoryComponent } from './payment-process/payment-history/payment-history.component';
import { PaymentHistoryListComponent } from './payment-process/payment-history/payment-history-list/payment-history-list.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { BasicTableComponent } from '../table/basic-table/basic-table.component';
import { CampusComponent } from './schoolportal/campus/campus.component';
import { CampusEditComponent } from './schoolportal/campus/campus-edit/campus-edit.component';
import { CampusProgramComponent } from './schoolportal/campus/campus-program/campus-program.component';
import { CampusProgramEditComponent } from './schoolportal/campus/campus-program/campus-program-edit/campus-program-edit.component';
import { PasswordSearchComponent } from './reset-password/password-search/password-search.component';
import { PaymentCsvComponent } from './payment-process/payment-csv/payment-csv.component';
import { WorkflowEditComponent } from './payment-process/payment-workflow/workflow-edit/workflow-edit.component';
import { BannedCountryComponent } from './locals/banned-country/banned-country.component';
import { EmailsComponent } from './emails/emails.component';
import { LgcManagementComponent } from './lgc-management/lgc-management.component';
import { TermsAndConditionsComponent } from './terms-and-conditions/terms-and-conditions.component';
import { TermsPerRoleComponent } from './terms-and-conditions/terms-per-role/terms-per-role.component';
import { AgreedTermsAndConditionsComponent } from './terms-and-conditions/agreed-terms-and-conditions/agreed-terms-and-conditions.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminRoutes),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    TooltipModule.forRoot(),
    NgxEditorModule,
    PaginationModule,
    NgxPaginationModule
  ],
  declarations: [
    SchoolportalComponent,
    SchoolprogramsComponent,
    ProgramspertermComponent,
    AgentManagementComponent,
    AgentEditComponent,
    AgentSearchComponent,
    BranchManagementComponent,
    BranchEditComponent,
    BranchSearchComponent,
    UserpasswordComponent,
    FieldErrorDisplayComponent,
    AgencyManagementComponent,
    LgcManagementComponent,
    TermsAndConditionsComponent,
    MenuListComponent,
    LocalsComponent,
    CountryComponent,
    ProvinceComponent,
    CityComponent,
    LanguageComponent,
    SchoolComponent,
    TermComponent,
    TypeOfSchoolComponent,
    TypeOfProgramComponent,
    DisciplineComponent,
    ApplicationComponent,
    InternalStatusComponent,
    InternalStatusWorkflowComponent,
    StatusComponent,
    EducationTypeComponent,
    UserProfileComponent,
    MenuComponent,
    RoleMenuComponent,
    RoleComponent,
    AgencyEditComponent,
    UsersComponent,
    RoleComponent,
    UsersListComponent,
    CountrySearchComponent,
    CountryEditComponent,
    ProvinceEditComponent,
    ProvinceSearchComponent,
    CitySearchComponent,
    CityEditComponent,
    LanguageEditComponent,
    LanguageSearchComponent,
    SubMenuComponent,
    SubMenuListComponent,
    RoleMenuListComponent,
    InternalStatusListComponent,
    IntStatusWorkflowListComponent,
    EducationEditComponent,
    EducationSearchComponent,
    InternalStatusListComponent,
    StatusEditComponent,
    StatusSearchComponent,
    PaymentProcessComponent,
    PaymentConceptsComponent,
    PaymentComponent,
    DashboardComponent,
    PaymentGatewayComponent,
    RoleMenuSearchComponent,
    PaymentStateComponent,
    StateEditComponent,
    PaymentWorkflowComponent,
    PaymentHistoryComponent,
    PaymentHistoryListComponent,
    ResetPasswordComponent,
    BasicTableComponent,
    CampusComponent,
    CampusEditComponent,
    CampusProgramComponent,
    CampusProgramEditComponent,
    PasswordSearchComponent,
    PaymentCsvComponent,
    WorkflowEditComponent,
    BannedCountryComponent,
    EmailsComponent,
    TermsPerRoleComponent,
    AgreedTermsAndConditionsComponent
  ]
})
export class AdminModule { }
