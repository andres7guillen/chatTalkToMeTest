import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken  } from "firebase/messaging";
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private messaging = getMessaging(initializeApp(environment.firebase));
  public notification$ = new BehaviorSubject<any>(null);

  constructor(private router: Router) {
    const firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(firebaseApp);
  
    // 📌 Recuperar chatId de localStorage si la app se abrió desde una notificación
    const pendingChatId = localStorage.getItem('pendingChatId');
    if (pendingChatId) {
      this.router.navigate([`/chats/${pendingChatId}`]);
      localStorage.removeItem('pendingChatId'); // Limpiar después de navegar
    }
  
    onMessage(this.messaging, (payload) => {
      console.log("🔔 Notificación recibida:", payload);

      // this.notification$.next(payload);
  
      
      const chatId = payload?.data?.['chatId'];
      console.log("📌 chatId recibido:", chatId);
      // if (document.hidden) {
      //   const chatId = payload?.data?.['chatId'];
      //   localStorage.setItem('pendingChatId', chatId || '');
      //   console.log("📌 Guardando chatId en localStorage:", chatId);

      // }

      if (chatId) {
        localStorage.setItem('pendingChatId', chatId);
        console.log("✅ chatId guardado en localStorage:", chatId);
      } else {
        console.warn("⚠️ No se guardó chatId en localStorage.");
      }
    });
  }
  
  

  async getFCMToken(): Promise<string | null> {
    try {
      const permissionGranted = await this.requestPermission();
      if (!permissionGranted) {
        console.warn('Permiso de notificaciones denegado.');
        return null;
      }

      const token = await getToken(this.messaging, { vapidKey: environment.firebase.vapidKey });
      return token;
    } catch (error) {
      console.error('Error obteniendo el token:', error);
      return null;
    }
  }

  async requestPermission(): Promise<boolean> {
    
    if (!("Notification" in window)) {
      console.error("Las notificaciones no están soportadas en este navegador.");
      return false;
    }
  
    try {
      const permission = await Notification.requestPermission();
      console.log("Permiso obtenido:", permission); 
      return permission === 'granted';
    } catch (error) {
      console.error("Error solicitando permiso de notificaciones:", error);
      return false;
    }
  }

  getNotificationObservable() {
    return this.notification$.asObservable();
  }
}
