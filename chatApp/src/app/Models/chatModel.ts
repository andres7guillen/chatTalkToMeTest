export interface Message {
  userNameWhoTalk: string;
  userNameTalked: string;
  message: string;
  timeStamp: string;
}

export interface Chat {
  userNames: {
    User1: string;
    User2: string;
  };
  createdAt: string;
  messages: { [messageId: string]: Message };
}