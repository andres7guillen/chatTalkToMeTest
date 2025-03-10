import { Component, Injector, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Chat } from 'src/app/Models/chatModel';
import { ISendMessageRequest } from 'src/app/Models/sendMessageRequestModel';
import { FirebaseRealTimeService } from 'src/app/Services/firebase-real-time.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.css']
})
export class ChatsComponent implements OnInit {
  private _realTimeDbService!: FirebaseRealTimeService;
  private messagesSubscription: Subscription | null = null;
  public chatId!: string;
  public chatData!: Chat;
  public formulario!: FormGroup;
  public messages: any[] = [];
  public userName!: string;
  public messageToSend = '';
  public userNameSelected = '';

  constructor(private _fb: FormBuilder,private _route: ActivatedRoute,private _injector: Injector){}

  ngOnInit(): void {
    this._realTimeDbService = this._injector.get(FirebaseRealTimeService);
    this.getChatById();
    this.createForm();
    this.getOtherUser();
    this.listenForMessages();
  }
  

  getOtherUser() {
    this.userName = localStorage.getItem('userName')!.toString();
    const otherUser = this.chatId.replace(this.userName, '').replace(/^_+|_+$/g, '');
    this.formulario.patchValue({
      userNameSelected: otherUser
    });
  }

  createForm(): void {
    this.formulario = this._fb.group({
      count: [null, [Validators.min(1), Validators.max(40)]],
      userNameSelected: [''],
      messageToSend: [''],
    });
  }

  getChatById(){
    this._route.paramMap.subscribe(params => {
      this.chatId = params.get('chatId') || '';
      // if (this.chatId) {
      //   //this.getMessagesChat(this.chatId);
      // }
    });
  }

  listenForMessages() {
    const chatId = this.chatId;
    this.messagesSubscription?.unsubscribe();

    this.messagesSubscription = this._realTimeDbService.getMessages(chatId).subscribe((messages) => {
        this.messages = Object.values(messages || {});
    });
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
    
        const message: ISendMessageRequest = {
          userNameWhoTalk: this.userName,        
          userNameTalked: this.userNameSelected, 
          message: this.messageToSend,           
          timestamp: Date.now()
        };

        this._realTimeDbService.sendMessageToUserApi(message).subscribe({
          next: (data) => {
            if(data)
              this.chatId = data.data.chatId;
            this.messageToSend = '';
          },
          error: (error) => {
            console.log(error.message);
            alert(error.message);
          }
        });

      }else
      {
        this.messageToSend = this.formulario.get('messageToSend')?.value;
        this.userNameSelected = this.formulario.get('userNameSelected')?.value;
        if (!this.userNameSelected || !this.messageToSend.trim()) {
          alert('Debes ingresar un usuario y un mensaje.');
          return;
        }
    
        const message: ISendMessageRequest = {
          userNameWhoTalk: this.userName,        
          userNameTalked: this.userNameSelected, 
          message: this.messageToSend,           
          timestamp: Date.now()
        };

        this._realTimeDbService.sendMessageToUserApi(message).subscribe({
          next: (data) => {
            if(data)
              this.chatId = data.data.chatId;
            this.messageToSend = '';
          },
          error: (error) => {
            console.log(error.message);
            alert(error.message);
          }
        })
      }  
  }

  deleteMessage(idMessage: string){
    this._realTimeDbService.deleteMessageApi(this.chatId,idMessage).subscribe({
      next: (data) => {

      },
      error: (error) => {

      }
    })
  }

}
