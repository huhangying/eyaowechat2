import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './components/chat/chat.component';
import { AuthGuard } from './core/services/auth.guard';
import { BookComponent } from './components/book/book.component';
import { MyDoctorsComponent } from './components/my-doctors/my-doctors.component';
import { MyReservationComponent } from './components/my-reservation/my-reservation.component';
import { MyHistoryComponent } from './components/my-history/my-history.component';
import { CurrentDiagnoseComponent } from './components/current-diagnose/current-diagnose.component';
import { EntryComponent } from './components/entry/entry.component';
import { ChatSelectComponent } from './components/chat/chat-select/chat-select.component';
import { BookSelectComponent } from './components/book/book-select/book-select.component';
import { AddDoctorComponent } from './components/my-doctors/add-doctor/add-doctor.component';
import { DoctorDetailsComponent } from './components/my-doctors/doctor-details/doctor-details.component';
import { UserResolver } from './services/resolvers/user.resolver';


const routes: Routes = [
  {
    path: 'book-select',
    component: BookSelectComponent,
    canActivate: [AuthGuard],
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
  },
  {
    path: 'chat',
    component: ChatComponent,
    canActivate: [AuthGuard],
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
    canActivate: [AuthGuard],
  },
  {
    path: 'add-doctor',
    component: AddDoctorComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-reservation',
    component: MyReservationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'my-history',
    component: MyHistoryComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'current-diagnose',
    component: CurrentDiagnoseComponent,
    canActivate: [AuthGuard],
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
