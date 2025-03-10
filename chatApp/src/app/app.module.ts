import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './Components/app.component';
import { ChatComponent } from './Components/chat/chat.component';
import { LoginComponent } from './Components/login/login.component';
import { RegisterComponent } from './Components/register/register.component';
import { NavComponent } from './Components/nav/nav.component';
import { HomeComponent } from './Components/home/home.component';
import { RankingComponent } from './Components/ranking/ranking.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Importa Firebase
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { ChatsComponent } from './Components/chats/chats.component';
import { FcmService } from './Services/fcm.service';

@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    LoginComponent,
    RegisterComponent,
    NavComponent,
    HomeComponent,
    RankingComponent,
    ChatsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideDatabase(() => getDatabase())
  ],
  providers: [FcmService],
  bootstrap: [AppComponent]
})
export class AppModule { }
// npm install @angular/service-worker
// npm install typescript@5.2 --save-dev //antigua version: 5.1.6
// 
