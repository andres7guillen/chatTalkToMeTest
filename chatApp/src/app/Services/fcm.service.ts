import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage, getToken } from "firebase/messaging";
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  private messaging = getMessaging(initializeApp(environment.firebase));

  constructor() 
  { 
    const firebaseApp = initializeApp(environment.firebase);
    this.messaging = getMessaging(firebaseApp);
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
    console.log("Solicitando permiso de notificaciones...");
    
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

  listenForMessages() {
    onMessage(this.messaging, (payload) => {
      console.log("Mensaje recibido:", payload);

      Swal.fire({
        title: payload.notification?.title || 'Nuevo Mensaje',
        text: payload.notification?.body || 'Tienes un nuevo mensaje',
        icon: 'info',
        showConfirmButton: false,
        timer: 4000,
        toast: true,
        position: 'top-end',
        background: '#ffebee', // Color de fondo rojo claro
        color: '#b71c1c' // Color del texto rojo oscuro
      });
    });
  }

}
