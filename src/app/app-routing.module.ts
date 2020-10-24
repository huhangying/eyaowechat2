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
import { MySurveysComponent } from './components/my-surveys/my-surveys.component';
import { DiagnoseHistoryComponent } from './components/profile/diagnose-history/diagnose-history.component';
import { MedicinePeriodsResolver } from './services/resolvers/medicine-periods.resolver';
import { DoseCombinationComponent } from './components/diagnose/feedback/dose-combination/dose-combination.component';
import { AdverseReactionComponent } from './components/diagnose/feedback/adverse-reaction/adverse-reaction.component';
import { AuthMockGuard } from './core/services/auth-mock.guard';
import { DoctorResolver } from './services/resolvers/doctor.resolver';
import { DoctorConsultResolver } from './services/resolvers/doctor-consult.resolver';
import { CustomerServiceDoctorResolver } from './services/resolvers/customer-service-doctor.resolver';
import { ArticleComponent } from './components/public/article/article.component';
import { SurveyStartComponent } from './components/my-surveys/survey-start/survey-start.component';
import { ReservationComponent } from './components/public/reservation/reservation.component';
import { BookingForwardComponent } from './components/public/booking-forward/booking-forward.component';
import { DiagnoseNoticeComponent } from './components/public/diagnose-notice/diagnose-notice.component';
import { ConsultComponent } from './components/consult/consult.component';
import { ConsultConfirmedComponent } from './components/consult/consult-confirmed/consult-confirmed.component';
import { ConsultReplyComponent } from './components/consult/consult-reply/consult-reply.component';
import { ConsultFinishComponent } from './components/consult/consult-finish/consult-finish.component';


const routes: Routes = [
  {
    path: 'book-select',    // <-
    component: BookSelectComponent,
    canActivate: [AuthGuard],
    // resolve: { user: UserResolver }
  },
  {
    path: 'book',
    component: BookComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  {
    path: 'chat-select',    // <-
    component: ChatSelectComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      csDoctor: CustomerServiceDoctorResolver
    }
  },
  {
    path: 'chat', // 免费
    component: ChatComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  {
    path: 'consult', // 收费咨询
    component: ConsultComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      doctor: DoctorResolver,
      doctorConsult: DoctorConsultResolver
    }
  },
  {
    path: 'consult-confirm', // 收费咨询确认
    component: ConsultConfirmedComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  {
    path: 'consult-reply', // 药师收费咨询回复
    component: ConsultReplyComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  {
    path: 'consult-finish', // 药师收费咨询完成
    component: ConsultFinishComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },

  {
    path: 'my-doctors',    // <-
    component: MyDoctorsComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'doctor-details',
    component: DoctorDetailsComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  {
    path: 'add-doctor',
    component: AddDoctorComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      csDoctor: CustomerServiceDoctorResolver
    }
  },
  {
    path: 'my-reservation',    // <-
    component: MyReservationComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  // 
  {
    path: 'profile',    // <-
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
    path: 'survey-start', // for link entry
    component: SurveyStartComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'diagnose-history',
    component: DiagnoseHistoryComponent,
    canActivate: [AuthGuard],
    resolve: {
      user: UserResolver,
      medicinePeriods: MedicinePeriodsResolver
    }
  },
  //
  {
    path: 'current-diagnose',    // <-
    component: CurrentDiagnoseComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, medicinePeriods: MedicinePeriodsResolver }
  },
  {
    path: 'adverse-reaction',
    component: AdverseReactionComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  {
    path: 'dose-combination',
    component: DoseCombinationComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver, doctor: DoctorResolver }
  },
  // shared
  {
    path: 'article',
    component: ArticleComponent,
  },
  {
    path: 'reservation',
    component: ReservationComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'booking-forward',
    component: BookingForwardComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },
  {
    path: 'diagnose-notice',
    component: DiagnoseNoticeComponent,
    canActivate: [AuthGuard],
    resolve: { user: UserResolver }
  },

  {
    path: 'entry',
    component: EntryComponent,
    canActivate: [AuthMockGuard], // disable later
    resolve: { user: UserResolver }
  },
  { path: '', redirectTo: 'entry', pathMatch: 'full' },
  { path: '**', redirectTo: 'entry' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
