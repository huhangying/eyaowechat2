import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './core/services/api-interceptor';
import { BookComponent } from './components/book/book.component';
import { MyDoctorsComponent } from './components/my-doctors/my-doctors.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';
import { CurrentDiagnoseComponent } from './components/diagnose/current-diagnose/current-diagnose.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EntryComponent } from './components/entry/entry.component';
import { CoreModule } from './core/core.module';
import { ChatSelectComponent } from './components/chat/chat-select/chat-select.component';
import { BookSelectComponent } from './components/book/book-select/book-select.component';
import { AddDoctorComponent } from './components/my-doctors/add-doctor/add-doctor.component';
import { DoctorDetailsComponent } from './components/my-doctors/doctor-details/doctor-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookingListComponent } from './components/my-reservation/booking-list/booking-list.component';
import { BookingDetailsComponent } from './components/my-reservation/booking-details/booking-details.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { MySurveysComponent } from './components/my-surveys/my-surveys.component';
import { DiagnoseHistoryComponent } from './components/profile/diagnose-history/diagnose-history.component';
import { DiagnoseDetailsComponent } from './components/diagnose/diagnose-details/diagnose-details.component';
import { TodayNoticeComponent } from './components/diagnose/today-notice/today-notice.component';
import { SurveyEditComponent } from './components/my-surveys/survey-edit/survey-edit.component';
import { SurveyViewComponent } from './components/my-surveys/survey-view/survey-view.component';
import { AdverseReactionComponent } from './components/diagnose/feedback/adverse-reaction/adverse-reaction.component';
import { DoseCombinationComponent } from './components/diagnose/feedback/dose-combination/dose-combination.component';
import { FeedbackComponent } from './components/diagnose/feedback/feedback/feedback.component';
import { AddFeedbackComponent } from './components/diagnose/feedback/add-feedback/add-feedback.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    BookComponent,
    MyDoctorsComponent,
    MyReservationComponent,
    CurrentDiagnoseComponent,
    ProfileComponent,
    EntryComponent,
    ChatSelectComponent,
    BookSelectComponent,
    AddDoctorComponent,
    DoctorDetailsComponent,
    BookingListComponent,
    BookingDetailsComponent,
    UserInfoComponent,
    MySurveysComponent,
    DiagnoseHistoryComponent,
    DiagnoseDetailsComponent,
    TodayNoticeComponent,
    SurveyEditComponent,
    SurveyViewComponent,
    AdverseReactionComponent,
    DoseCombinationComponent,
    FeedbackComponent,
    AddFeedbackComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    BrowserAnimationsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
