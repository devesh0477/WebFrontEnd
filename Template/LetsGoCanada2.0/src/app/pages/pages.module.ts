import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../app.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PagesRoutes } from './pages.routing';
import { RegisterComponent } from './register/register.component';
import { LockComponent } from './lock/lock.component';
import { LoginComponent } from './login/login.component';
import { ApplicantLoginComponent } from './applicantLogin/login.component';
import { ApplicantRegisterComponent } from './applicantRegister/register.component';
import { FooterComponent } from './footer/footer.component';
import { RecoveryComponent } from './recovery/recovery.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(PagesRoutes),
    FormsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    LoginComponent,
    RegisterComponent,
    LockComponent,
    ApplicantLoginComponent,
    ApplicantRegisterComponent,
    FooterComponent,
    RecoveryComponent
  ]
})

export class PagesModule { }
