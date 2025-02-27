interface INewMessage {
  userName: string;
  message: string;    
}

export class NewMessage implements INewMessage
{
  userName: string;
  message: string;

  constructor(){
      this.message = '';
      this.userName = '';
  }

}