import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChatComponent } from './chat/chat.component';
import { AuthGuard } from './core/services/auth.guard';
import { OauthCallbackComponent } from './oauth-callback/oauth-callback.component';


const routes: Routes = [
  {
    path: 'chat',
    component: ChatComponent,
    canActivate : [AuthGuard],
  },
  {
    path: 'oauth-callback',
    component: OauthCallbackComponent,
  },
  { path: '', redirectTo: 'chat', pathMatch: 'full' },
  { path: '**', redirectTo: 'chat' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
