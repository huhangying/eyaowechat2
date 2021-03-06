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
import { LocalDatePipe } from './core/pipe/local-date.pipe';
import { ArticleComponent } from './components/public/article/article.component';
import { SurveyStartComponent } from './components/my-surveys/survey-start/survey-start.component';
import { ReservationComponent } from './components/public/reservation/reservation.component';
import { BookingForwardComponent } from './components/public/booking-forward/booking-forward.component';
import { DiagnoseNoticeComponent } from './components/public/diagnose-notice/diagnose-notice.component';
import { ConsultComponent } from './components/consult/consult.component';
import { WeixinPayComponent } from './components/consult/weixin-pay/weixin-pay.component';
import { ConsultConfirmedComponent } from './components/consult/consult-confirmed/consult-confirmed.component';
import { ConsultRequestContentComponent } from './components/consult/consult-request-content/consult-request-content.component';
import { ConsultReplyComponent } from './components/consult/consult-reply/consult-reply.component';
import { ConsultFinishComponent } from './components/consult/consult-finish/consult-finish.component';
import { TodayReminderComponent } from './components/diagnose/today-reminder/today-reminder.component';
import { UserAgreementComponent } from './components/user/user-agreement/user-agreement.component';
import { FaqComponent } from './components/public/faq/faq.component';
import { HotNewsComponent } from './components/public/hot-news/hot-news.component';
import { NewsSearchComponent } from './components/public/hot-news/news-search/news-search.component';
import { PartyNewsComponent } from './components/public/hot-news/party-news/party-news.component';
import { MyAdvisesComponent } from './components/my-advises/my-advises.component';
import { AdviseDetailsComponent } from './components/my-advises/advise-details/advise-details.component';
import { MyAdviseComponent } from './components/my-advises/my-advise/my-advise.component';
import { ViewAdviseComponent } from './components/my-advises/view-advise/view-advise.component';
import { AdviseCommentComponent } from './components/my-advises/view-advise/advise-comment/advise-comment.component';

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
    ArticleComponent,
    SurveyStartComponent,
    ReservationComponent,
    BookingForwardComponent,
    DiagnoseNoticeComponent,
    ConsultComponent,
    WeixinPayComponent,
    ConsultConfirmedComponent,
    ConsultRequestContentComponent,
    ConsultReplyComponent,
    ConsultFinishComponent,
    TodayReminderComponent,
    UserAgreementComponent,
    FaqComponent,
    HotNewsComponent,
    NewsSearchComponent,
    PartyNewsComponent,
    MyAdvisesComponent,
    AdviseDetailsComponent,
    MyAdviseComponent,
    ViewAdviseComponent,
    AdviseCommentComponent,
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
    LocalDatePipe,
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
