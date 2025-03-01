import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {
  public urlBase: string = 'https://localhost:7004';
  public urlUser: string = `${this.urlBase}/api/user/`;
  public urlRealTimeDb: string = `${this.urlBase}/api/FireBase/`;
  public urlGender: string = `${this.urlBase}/api/Gender`;
  public urlWalkingView: string = `${this.urlBase}/api/walkingView/`;
  public urlHub:string = `${this.urlBase}/chatHub`;
  public realTimeUrl:string = 'https://talktomeapp-4d11c-default-rtdb.firebaseio.com/Chats';
}

