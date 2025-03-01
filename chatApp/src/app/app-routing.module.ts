import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { NavComponent } from './Components/nav/nav.component';
import { ChatComponent } from './Components/chat/chat.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { RankingComponent } from './Components/ranking/ranking.component';
import { AuthGuard } from './Guards/auth.guard';

const routes: Routes = [
  { path: 'home', component: HomeComponent, canActivate:[ AuthGuard ] },
  { path: 'nav', component: NavComponent },
  { path: 'chat', component: ChatComponent, canActivate:[ AuthGuard ] },
  { path: 'chat:chatId', component: ChatComponent, canActivate:[ AuthGuard ] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'ranking', component: RankingComponent, canActivate:[ AuthGuard ] },
  { path: '**', redirectTo: 'register' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
