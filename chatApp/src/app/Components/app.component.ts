import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FcmService } from '../Services/fcm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'chatApp';

  constructor(private _fcmService: FcmService, private router: Router) {}

  ngOnInit() {
    // 📌 Verificar si hay un chat pendiente en localStorage al iniciar la app
    const pendingChatId = localStorage.getItem('pendingChatId');
    console.log("🟢 Valor pendingChatId en localStorage al iniciar la app:", pendingChatId);

    if (pendingChatId) {
      localStorage.removeItem('pendingChatId');
      console.log("🚀 Navegando a:", `/chats/${pendingChatId}`);
      this.router.navigate([`/chats/${pendingChatId}`]);
    }

    // 📌 Suscribirse a notificaciones en tiempo real
    this._fcmService.notification$.subscribe(payload => {
      console.log("📩 Notificación recibida en tiempo real:", payload);
      const chatId = payload?.data?.['chatId'];
  
      if (chatId && !this.router.url.includes(`/chats/${chatId}`)) {
        console.log("🚀 Navegando a (desde notificación en tiempo real):", `/chats/${chatId}`);
        this.router.navigate([`/chats/${chatId}`]);
      }
    });
  }
}
