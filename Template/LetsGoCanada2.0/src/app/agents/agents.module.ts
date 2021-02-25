import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { RouterModule } from '@angular/router';

import { AgentsRoutes } from './agents.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NouisliderModule } from 'ng2-nouislider';
import { TagInputModule } from 'ngx-chips';
import { MaterialModule, AppModule } from '../app.module';
import { SearchComponent } from './search/search.component';
import { SchoolComponent } from './search/school/school.component';
import { GalleryComponent } from './search/school/gallery/gallery.component';
import { SummaryComponent } from './search/school/summary/summary.component';
import { InfoComponent } from './search/school/info/info.component';
import { ApplicantsComponent } from './applicants/applicants.component';
import { ApplicationsComponent } from './applications/applications.component';
import { SearchSchoolComponent } from './search/search-school/search-school.component';
import { ProgramsComponent } from './search/school/info/programs/programs.component';
import { ApplicationDetailsComponent } from './application-details/application-details.component';
import { ProgramListComponent } from './search/program-list/program-list.component';
import { FinancialComponent } from './search/school/info/financial/financial.component';
import { DisciplinesComponent } from './search/school/info/disciplines/disciplines.component';
import { ProgramDetailComponent } from './search/program-list/program-detail/program-detail.component';
import { JwPaginationComponent } from 'jw-angular-pagination';
import { PaginationModule } from '../pagination/pagination.module';
import { ChartsModule } from 'ng2-charts';
import { ApplicationsResultComponent } from './applications/applications-result/applications-result.component';
import { CampusComponent } from './search/school/info/campus/campus.component';
import { CampusDetailsComponent } from './search/school/info/campus/campus-details/campus-details.component';
import { GenericProgramListComponent } from '../shared/generic-program-list/generic-program-list.component';
import { ApplyModalComponent } from './search/apply-modal/apply-modal.component';
import { ProfiComponent } from './profi/profi.component';
import { ProfiBasicComponent } from './profi/profi-basic/profi-basic.component';
import { ProfiEducationComponent } from './profi/profi-education/profi-education.component';
import { ProfiLanguageComponent } from './profi/profi-language/profi-language.component';
import { ProfiBackgroundComponent } from './profi/profi-background/profi-background.component';
import { ProfiDocumentsComponent } from './profi/profi-documents/profi-documents.component';
import { GenericVideoSelectorComponent } from '../shared/generic-video-selector/generic-video-selector.component';
import { ExpressApplicationComponent } from './applications/express-application/express-application.component';
import { ExistentApplicationComponent } from './applications/express-application/existent-application/existent-application.component';
import { NewApplicationWizardComponent } from './applications/express-application/new-application-wizard/new-application-wizard.component';
import { StudentInfoComponent } from './applications/express-application/new-application-wizard/student-info/student-info.component';
import { DocumentsComponent } from './applications/express-application/new-application-wizard/documents/documents.component';
import { PaymentComponent } from './applications/express-application/new-application-wizard/payment/payment.component';
import { ExpressProgramsComponent } from './applications/express-application/new-application-wizard/express-programs/express-programs.component';


// import { FieldErrorDisplayComponent } from '../forms/validationforms/field-error-display/field-error-display.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AgentsRoutes),
    FormsModule,
    ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
    NouisliderModule,
    TagInputModule,
    MaterialModule,
    PaginationModule,
    ChartsModule
  ],
  declarations: [
    ProfileComponent,
    SearchComponent,
    SchoolComponent,
    GalleryComponent,
    SummaryComponent,
    InfoComponent,
    ApplicantsComponent,
    ApplicationsComponent,
    SearchSchoolComponent,
    ProgramsComponent,
    ApplicationDetailsComponent,
    ProgramListComponent,
    FinancialComponent,
    DisciplinesComponent,
    ProgramDetailComponent,
    ApplicationsResultComponent,
    CampusComponent,
    CampusDetailsComponent,
    GenericProgramListComponent,
    ApplyModalComponent,
    ProfiComponent,
    ProfiBasicComponent,
    ProfiEducationComponent,
    ProfiLanguageComponent,
    ProfiBackgroundComponent,
    ProfiDocumentsComponent,
    GenericVideoSelectorComponent,
    ExpressApplicationComponent,
    ExistentApplicationComponent,
    NewApplicationWizardComponent,
    StudentInfoComponent,
    DocumentsComponent,
    PaymentComponent,
    ExpressProgramsComponent
  ],
  exports: []
})
export class AgentsModule { }
