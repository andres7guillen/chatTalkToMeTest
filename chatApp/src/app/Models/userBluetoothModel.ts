interface IUserBluetooth{
    connectionId: string;
    userName: string;
}

export class UserBluetooth implements IUserBluetooth{
    connectionId: string = '';
    userName: string = '';
}