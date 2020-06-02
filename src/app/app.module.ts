import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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
import { MyHistoryComponent } from './components/my-history/my-history.component';
import { EntryComponent } from './components/entry/entry.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    BookComponent,
    MyDoctorsComponent,
    MyReservationComponent,
    CurrentDiagnoseComponent,
    MyHistoryComponent,
    EntryComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
