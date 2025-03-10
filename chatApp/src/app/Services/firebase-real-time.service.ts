import { Injectable, Injector } from '@angular/core';
import { Database, ref, push, set, onValue } from '@angular/fire/database';
import { Observable, Subject } from 'rxjs';
import { ApiResponse } from '../Models/ApiResponseModel';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConnectionService } from './connection.service';
import { Chat, Message } from '../Models/chatModel';
import { DeleteMessage } from '../Models/deleteMessageModel';
import { ISendMessageRequest } from '../Models/sendMessageRequestModel';

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
        //'ngrok-skip-browser-warning': 'true',
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

  sendMessageToUserApi(message: ISendMessageRequest): Observable<ApiResponse<{ chatId: string; message: string }>> {  
    return this._http.post<ApiResponse<{ chatId: string; message: string }>>(
      `${this._conn.urlRealTimeDb}sendMessage`, 
      message, 
      { headers: this.getHeaders() }
    );
  }

  deleteMessageApi(chatId: string, messageId: string):Observable<any> {
    const model: DeleteMessage = {
      chatId: chatId,
      messageId: messageId
    };
  
    return this._http.delete(`${this._conn.urlRealTimeDb}delete-message`,{
      body: model,
      headers: this.getHeaders()
    });
  }

  async sendMessageToChat(chatId: string, message: any): Promise<void> {
    const messagesRef = ref(this._db, `Chats/${chatId}/Messages`);
    const newMessageRef = push(messagesRef); // Crea una nueva referencia para el mensaje
    return set(newMessageRef, message); // Guarda el mensaje en esa referencia
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
    return new Observable(observer => {
      const messagesRef = ref(this._db, `Chats/${chatId}/Messages`);
      
      onValue(messagesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const messagesArray = Object.entries(data).map(([id, msg]: any) => ({ id, ...msg }));
          observer.next(messagesArray);
        } else {
          observer.next([]);
        }
      }, {
        onlyOnce: false // Mantener la suscripción en tiempo real
      });
    });
  }

  getChatById(chatid:string): Observable<Chat>
  {
    return this._http.get<Chat>(`${this._conn.realTimeUrl}/${chatid}.json`);
  }

  connectUser(userName: string): Observable<any>
  {
    const url = `${this._conn.urlRealTimeDb}connect/${userName}`;
    const body = { isOnline: true };
    return this._http.patch(url, body, { headers: this.getHeaders() });
  }

  disconnectUser(userName: string): Observable<any>
  {
    const url = `${this._conn.urlRealTimeDb}disconnect/${userName}`;
    const body = { isOnline: false };
    return this._http.patch(url, body, { headers: this.getHeaders() });
  }

}
