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
import { MyHistoryComponent } from './components/my-history/my-history.component';
import { EntryComponent } from './components/entry/entry.component';
import { CoreModule } from './core/core.module';
import { SelectDoctorsComponent } from './core/component/select-doctors/select-doctors.component';
import { ChatSelectComponent } from './components/chat/chat-select/chat-select.component';
import { MyDoctorsSelectComponent } from './components/my-doctors/my-doctors-select/my-doctors-select.component';
import { BookSelectComponent } from './components/book/book-select/book-select.component';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    BookComponent,
    MyDoctorsComponent,
    MyReservationComponent,
    CurrentDiagnoseComponent,
    MyHistoryComponent,
    EntryComponent,
    ChatSelectComponent,
    MyDoctorsSelectComponent,
    BookSelectComponent,   

  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CoreModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ApiInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

 }
