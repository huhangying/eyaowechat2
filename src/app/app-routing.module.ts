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


const routes: Routes = [
  {
    path: 'book',
    component: BookComponent,
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
  { path: '**', redirectTo: 'chat' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
