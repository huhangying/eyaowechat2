import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './core/services/auth.guard';
import { BookComponent } from './components/book/book.component';
import { MyDoctorsComponent } from './components/my-doctors/my-doctors.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CurrentDiagnoseComponent } from './components/diagnose/current-diagnose/current-diagnose.component';
import { EntryComponent } from './components/entry/entry.component';
import { ChatSelectComponent } from './components/chat/chat-select/chat-select.component';
import { BookSelectComponent } from './components/book/book-select/book-select.component';
import { AddDoctorComponent } from './components/my-doctors/add-doctor/add-doctor.component';
import { DoctorDetailsComponent } from './components/my-doctors/doctor-details/doctor-details.component';
import { UserResolver } from './services/resolvers/user.resolver';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { MySurveysComponent } from './components/profile/my-surveys/my-surveys.component';
import { DiagnoseHistoryComponent } from './components/profile/diagnose-history/diagnose-history.component';
import { MedicinePeriodsResolver } from './services/resolvers/medicine-periods.resolver';


const routes: Routes = [
  {
    path: 'book-select',
    component: BookSelectComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'book',
    component: BookComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'chat-select',
    component: ChatSelectComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'chat',
    component: ChatComponent,
    // canActivate: [AuthGuard],
  },

  {
    path: 'my-doctors',
    component: MyDoctorsComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'doctor-details',
    component: DoctorDetailsComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'add-doctor',
    component: AddDoctorComponent,
    // canActivate: [AuthGuard],
  },
  {
    path: 'my-reservation',
    component: MyReservationComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  // 
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'user-info',
    component: UserInfoComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'my-surveys',
    component: MySurveysComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'diagnose-history',
    component: DiagnoseHistoryComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver,
      medicinePeriods: MedicinePeriodsResolver }
  },
  //
  {
    path: 'current-diagnose',
    component: CurrentDiagnoseComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'entry',
    component: EntryComponent,
  },
  { path: '', redirectTo: 'entry', pathMatch: 'full' },
  { path: '**', redirectTo: 'entry' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
