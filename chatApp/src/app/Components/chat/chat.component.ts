import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
//import {
  //HttpTransportType,
  // HubConnection,
  // HubConnectionBuilder,
  // HubConnectionState,
  // LogLevel,
// } from '@microsoft/signalr';
import { NewMessage } from 'src/app/Models/newMessageModel';

import { UserBluetooth } from 'src/app/Models/userBluetoothModel';
import { FcmService } from 'src/app/Services/fcm.service';
import { UserService } from 'src/app/Services/user.service';
import { FirebaseRealTimeService } from 'src/app/Services/firebase-real-time.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit {
  private _realTimeDbService!: FirebaseRealTimeService;
  public showUsersFound: boolean = false;
  public formulario!: FormGroup;
  public userName!: string;
  public messageToSend = '';
  public token!: string;
  public fcmToken!: string;
  public chatId:string = '';
  //public connectionId = '';
  public userNameSelected = '';
  public count: number = 0;
  public usersBluetooth: UserBluetooth[] = [];
  public conversation: NewMessage[] = [
    {
      message: '',
      userName: '',
    },
  ];
  // private _hubConnection: HubConnection;

  constructor(
    private injector: Injector,
    private _userService: UserService,
    //private _realTimeDbService : FirebaseRealTimeService,
    private _fb: FormBuilder, 
    //private _urls:ConnectionService,
    private _fcmService: FcmService,) {
    
    this.token = localStorage.getItem('token')!.toString();

  //   this._hubConnection = new HubConnectionBuilder()
  // .withUrl(this._urls.urlHub, {
  //   accessTokenFactory: () => this.token,
  //   skipNegotiation: true, // 🚀 Importante: Desactiva negociación
  //   transport: HttpTransportType.WebSockets, // 🚀 Fuerza WebSockets
  // })
  // .withAutomaticReconnect()
  // .configureLogging(LogLevel.Information)
  // .build();

    // this._hubConnection.onclose((error) => {
    //   console.log(`Conexión cerrada. Error: ${error}`);
    // });

    // this._hubConnection.onreconnecting((error) => {
    //   console.log('Reconectando...', error);
    // });

    // this._hubConnection.onreconnected((connectionId) => {
    //   console.log('Reconexión exitosa. Nuevo ConnectionId:', connectionId);
    // });

    // this.startConnection();

    // this._hubConnection.on('ReceiveMessage', (userNameSender, message) => {
    //   this.conversation.push({
    //     message: message,
    //     userName: userNameSender,
    //   });
    // });
  }

  ngOnInit(): void {
    this._realTimeDbService = this.injector.get(FirebaseRealTimeService);
    this.requestFcmToken();
    this._fcmService.listenForMessages(); // Escuchar mensajes en primer plano
    this.getUsersFoundByBluetooth();
    this.createForm();
    this.userName = localStorage.getItem('userName')!.toString();
    this.listenForMessages();
  }

  listenForMessages() {
    const chatId = this.chatId; // Debes obtener el ID del chat dinámicamente
    this._realTimeDbService.getMessages(chatId).subscribe((messages) => {
      console.log("Mensajes recibidos:", messages);
      this.conversation = messages; // Actualiza la conversación con los mensajes nuevos
    });
  }

  showSuccessMessage(message: string) {
    Swal.fire({
      title: 'Nuevo Mensaje 📩',
      text: message,
      icon: 'success',
      showConfirmButton: false,
      timer: 3000,
      toast: true,
      position: 'top-end',
      background: '#e3f2fd', // Color de fondo azul claro
      color: '#0d47a1' // Color del texto azul oscuro
    });
  }

  async requestFcmToken() {
    try {
      const token = await this._fcmService.getFCMToken();
      if (token) {
        console.log('FCM Token obtenido:', token);
        localStorage.setItem('fcmToken', token); // Guardar en Local Storage
        this.saveFcmToUser();
      }
    } catch (error) {
      console.error('Error al obtener el token FCM:', error);
    }
  }

  saveFcmToUser(){
    this.fcmToken = localStorage.getItem('fcmToken')!.toString();
    this._realTimeDbService.updateFcmTokenIdInUser(this.userName, this.fcmToken).subscribe({
      next: (data) => {
        if (data != undefined) {
          console.log('CONSOLE LOG UPDATE TOKEN: ' + data)
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }
  
  createForm(): void {
    this.formulario = this._fb.group({
      count: [null, [Validators.min(1), Validators.max(40)]],
      userNameSelected: [''],
      messageToSend: [''],
    });
  }

  // startConnection() {
  //   this._hubConnection
  //     .start()
  //     .then(() => {
  //       console.log('Connection started');
  //     })
  //     .catch((error) => {
  //       console.error('Error starting connection: ', error);
  //     });
  // }

  // public stopConnection() {
  //   this._hubConnection
  //     .stop()
  //     .then(() => {
  //       console.log('Conexión desconectada');
  //     })
  //     .catch((error) => {
  //       console.error('Error al desconectar:', error);
  //     });
  // }

  public getUsersFoundByBluetooth() {
    this.count = 10; //this.formulario.get('count')?.value;
    this._userService.getUsersFoundByBluetooth(this.count).subscribe({
      next: (data) => {
        if (data != undefined) {
          this.usersBluetooth = data;
          this.showUsersFound = true;
        }
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  // public sendMessage() {   
  //   this.userNameSelected = this.formulario.get('userNameSelected')?.value;
  //   this.messageToSend = this.formulario.get('messageToSend')?.value;

  //   if(this._hubConnection.state === HubConnectionState.Connected){
  //     this._hubConnection
  //     .invoke(
  //       'SendMessage',
  //       this.userName, // userNameSender
  //       this.userNameSelected, // userNameReceiver
  //       this.messageToSend
  //     )
  //     .then((data) => {
  //       var newMessage = new NewMessage();
  //       newMessage.message = this.messageToSend;
  //       newMessage.userName = this.userName;
  //       this.newMessage(newMessage);
  //       this.formulario.get('messageToSend')!.setValue('');
  //     });
  //   }
  // }

  public selectUser(event: any): void {
    this.userNameSelected = event.target.value;
  }

  public onSubmit(formulario: NgForm) {
    if (formulario.valid) {
      // this.sendMessage();
    }
  }

  private newMessage(message: NewMessage) {
    this.conversation.push(message);
  }

  sendMessage() {
    if(this.chatId == null || this.chatId == '')
      {
        this.messageToSend = this.formulario.get('messageToSend')?.value;
        this.userNameSelected = this.formulario.get('userNameSelected')?.value;
        if (!this.userName || !this.messageToSend.trim()) {
          alert('Debes ingresar un usuario y un mensaje.');
          return;
        }
    
        const message = {
          userNameWhoTalk: this.userName, // Cambiar por el usuario que envía el mensaje
          message: this.messageToSend,
          userNameTalked: this.userNameSelected,
          timestamp: Date.now()
        };
        this._realTimeDbService.sendMessageToUserApi(this.userName,this.messageToSend,
          this.userNameSelected
        ).subscribe({
          next: (data) => {
            if(data)
              this.chatId = data.data
          },
          error: (error) => {
            console.log(error);
          }
        })

      }else{
        const message = {
          userNameWhoTalk: this.userName, // Cambiar por el usuario que envía el mensaje
          message: this.messageToSend,
          userNameTalked: this.userNameSelected,
          timestamp: Date.now()
        };
        this._realTimeDbService.sendMessageToUser(this.userName, message)
      .then(() => {
        this.messageToSend = ''; // Limpiar el campo de texto después de enviar
      })
      .catch((err) => console.error('Error al enviar mensaje:', err));
      }
    

    
  }

}
