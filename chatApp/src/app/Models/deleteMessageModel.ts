export interface IDeleteMessage{
    chatId: string;
    messageId:string;
}

export class DeleteMessage implements IDeleteMessage
{
    chatId: string = '';
    messageId:string = '';
}