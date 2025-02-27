import { Injectable, Injector } from '@angular/core';
import { Database, ref, push, set, onValue } from '@angular/fire/database';
import { Observable, Subject } from 'rxjs';
import { NewMessage } from '../Models/newMessageModel';
import { ApiResponse } from '../Models/ApiResponseModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from './connection.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseRealTimeService {

  constructor(private _db: Database,
    private _http: HttpClient,
    private _conn: ConnectionService) {}

    

    private getHeaders(): HttpHeaders {
      return new HttpHeaders({
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        "Authorization": "Bearer " + localStorage.getItem('token') || ''
      });
    }

  sendMessage(chatId: string, message: any): Promise<void> {
    const messageRef = push(ref(this._db, `chats/${chatId}`));
    return set(messageRef, message);
  }

  // sendMessageToUser(userName: string, message: NewMessage): Promise<void> {
  //   const messageRef = push(ref(this.db, `messages/${userName}`));
  //   return set(messageRef, message);
  // }

  sendMessageToUserApi(
    withUserNameWhoTalks: string, 
    withMessage: string, 
    withUserNameTalked: string
  ): Observable<ApiResponse<string>> {
    
    const message = {
      userNameWhoTalk: withUserNameWhoTalks,
      message: withMessage,
      userNameTalked: withUserNameTalked,
      timestamp: Date.now()
    };
  
    // Aseguramos que el tipo de respuesta sea `Observable<ApiResponse<string>>`
    return this._http.post<ApiResponse<string>>(
      `${this._conn.urlRealTimeDb}sendMessage`, 
      message, 
      { headers: this.getHeaders() }
    );
  }


  public updateFcmTokenIdInUser(userName:string, fcmToken: string): Observable<any>{
      const body = { fcmToken };
      return this._http.patch(`${this._conn.urlRealTimeDb}${userName}`, body, {
        headers: this.getHeaders()
      });
     }

  sendMessageToUser(userName: string, message: any): Promise<void> {
    const messagesRef = ref(this._db, `messages/${userName}`); // Guardamos el mensaje en la ruta del usuario
    const newMessageRef = push(messagesRef); // Generamos una nueva clave única para el mensaje
  
    return set(newMessageRef, message) // Guardamos el mensaje en la base de datos
      .then(() => console.log('Mensaje enviado con éxito'))
      .catch((err) => console.error('Error al enviar mensaje:', err));
  }

  getMessages(chatId: string): Observable<any[]> {
    const messagesRef = ref(this._db, `chats/${chatId}`);
    const messagesSubject = new Subject<any[]>(); // Para emitir los mensajes como Observable

    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      const messages = data ? Object.values(data) : [];
      messagesSubject.next(messages); // Emitimos la lista de mensajes
    });

    return messagesSubject.asObservable(); // Devolvemos un Observable
  }

}
