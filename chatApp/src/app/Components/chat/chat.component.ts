import { Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import Swal from 'sweetalert2/dist/sweetalert2.js';
//import {
  //HttpTransportType,
  // HubConnection,
  // HubConnectionBuilder,
  // HubConnectionState,
  // LogLevel,
// } from '@microsoft/signalr';
import { UserBluetooth } from 'src/app/Models/userBluetoothModel';
import { FcmService } from 'src/app/Services/fcm.service';
import { UserService } from 'src/app/Services/user.service';
import { FirebaseRealTimeService } from 'src/app/Services/firebase-real-time.service';
import { Chat, Message } from 'src/app/Models/chatModel';
import { ActivatedRoute } from '@angular/router';
import { OnlineStatusService } from 'src/app/Services/online-status-service';
import { Subscription } from 'rxjs';
import { child, get, getDatabase, ref } from 'firebase/database';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
})
export class ChatComponent implements OnInit,OnDestroy {
  private _realTimeDbService!: FirebaseRealTimeService;
  public isOnline: boolean = true;
  private subscription!: Subscription;
  public showUsersFound: boolean = false;
  public formulario!: FormGroup;
  public userName!: string;
  public messageToSend = '';
  public token!: string;
  public fcmToken!: string;
  public chatId!: string;
  public chatData!: Chat;
  //public connectionId = '';
  public userNameSelected = '';
  public count: number = 0;
  public usersBluetooth: UserBluetooth[] = [];
  //public messages: Message[] = [];
  public messages: any[] = []; // Aquí guardaremos los mensajes
  messagesSubscription!: Subscription;

  // private _hubConnection: HubConnection;

  constructor(
    private _onlineStatusService: OnlineStatusService,
    private _route: ActivatedRoute,
    private _injector: Injector,
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
    this._realTimeDbService = this._injector.get(FirebaseRealTimeService);
    this.userName = localStorage.getItem('userName')!.toString();
    this.connectUser();
    this.subscription = this._onlineStatusService.isOnline$.subscribe(status => {
      this.isOnline = status;
    });
    this._route.paramMap.subscribe(params => {
      this.chatId = params.get('chatId') || '';
      if (this.chatId) {
        this.loadChat();
      }
    });
    this.requestFcmToken();
    this._fcmService.listenForMessages(); // Escuchar mensajes en primer plano
    this.getUsersFoundByBluetooth();
    this.createForm();
    this.listenForMessages();
  }

  ngOnDestroy() {
    if (this.messagesSubscription) {
      this.messagesSubscription.unsubscribe(); // Para evitar fugas de memoria
    }

    // Evitar fugas de memoria
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this._realTimeDbService.disconnectUser(this.userName).subscribe({
      next: (response) => console.log("✅ Usuario desconectado:", response),
      error: (err) => console.error("❌ Error al desconectar usuario:", err)
  });
  }

  listenForMessages() {
    const chatId = this.chatId; // Asegúrate de que chatId esté definido
    this._realTimeDbService.getMessages(chatId).subscribe((messages) => {
      console.log("Mensajes recibidos:", messages);
      
      // Convertir los mensajes en un array antes de asignarlos
      this.messages = Object.values(messages || {});
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

  loadChat(): void {
    this._realTimeDbService.getChatById(this.chatId).subscribe(chat => {
      this.chatData = chat;
  
      // Convertir los mensajes en un array
      this.messages = Object.values(chat.messages || {});
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

  sendMessage() {debugger
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
          next: (data) => {debugger
            if(data)
              this.chatId = data.data.chatId;
            this.getMessagesChat(this.chatId);
          },
          error: (error) => {
            console.log(error.message);
            alert(error.message);
          }
        })

      }else{
        const message = {
          userNameWhoTalk: this.userName, 
          message: this.messageToSend,
          userNameTalked: this.userNameSelected,
          timestamp: Date.now()
      };
        this._realTimeDbService.sendMessageToChat(this.chatId, message)
      .then(() => {
        this.messageToSend = ''; // Limpiar el campo de texto después de enviar
      })
      .catch((err) => console.error('Error al enviar mensaje:', err));
      }    
  }

  getMessagesChat(chatId:string){debugger
    this._realTimeDbService.getMessages(chatId).subscribe((messages) => {
      console.log("📩 Mensajes obtenidos desde Firebase:", messages);
      this.messages = messages;
    });
  }

  connectUser()
  {
    this._realTimeDbService.connectUser(this.userName).subscribe({
      next: (res) => console.log('✅ Respuesta del backend:', res),
      error: (err) => console.error('❌ Error al conectar:', err)
    });
  }

}
