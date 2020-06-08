import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './components/chat/chat.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiInterceptor } from './core/services/api-interceptor';
import { BookComponent } from './components/book/book.component';
import { MyDoctorsComponent } from './components/my-doctors/my-doctors.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';
import { CurrentDiagnoseComponent } from './components/current-diagnose/current-diagnose.component';
import { ProfileComponent } from './components/profile/profile.component';
import { EntryComponent } from './components/entry/entry.component';
import { CoreModule } from './core/core.module';
import { SelectDoctorsComponent } from './core/component/select-doctors/select-doctors.component';
import { ChatSelectComponent } from './components/chat/chat-select/chat-select.component';
import { BookSelectComponent } from './components/book/book-select/book-select.component';
import { AddDoctorComponent } from './components/my-doctors/add-doctor/add-doctor.component';
import { DoctorDetailsComponent } from './components/my-doctors/doctor-details/doctor-details.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BookingListComponent } from './components/my-reservation/booking-list/booking-list.component';
import { BookingDetailsComponent } from './components/my-reservation/booking-details/booking-details.component';
import { UserInfoComponent } from './components/profile/user-info/user-info.component';
import { MySurveysComponent } from './components/profile/my-surveys/my-surveys.component';
import { DiagnoseHistoryComponent } from './components/profile/diagnose-history/diagnose-history.component';

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
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
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
