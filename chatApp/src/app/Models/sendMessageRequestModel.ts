export interface ISendMessageRequest{
    userNameWhoTalk: string;
    userNameTalked: string;
    message: string;
    timestamp: number;
}