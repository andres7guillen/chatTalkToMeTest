import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { FirebaseApp } from '@angular/fire/app';
import { Messaging, getMessaging, onMessage } from 'firebase/messaging';
import { FirebaseRealTimeService } from './firebase-real-time.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private messaging: Messaging;
  currentMessage = new BehaviorSubject(null);

  constructor(
    private router: Router,
    private realTimeDbService: FirebaseRealTimeService,
    @Inject(FirebaseApp) private firebaseApp: FirebaseApp
  ) {
    this.messaging = getMessaging(this.firebaseApp);
  }

  listenForNotifications() {
    onMessage(this.messaging, (payload) => {
      console.log("📩 Notificación recibida en la app:", payload);

      const chatId = payload.data?.["chatId"];
      if (chatId) {
        this.router.navigate([`/chat/${chatId}`]);
        this.getMessagesChat(chatId);
      }
    });
  }

  private getMessagesChat(chatId: string) {
    this.realTimeDbService.getMessages(chatId).subscribe((messages) => {
      console.log("📩 Mensajes obtenidos desde Firebase:", messages);
      // Aquí puedes hacer algo con los mensajes, como actualizarlos en un servicio global
    });
  }
}
