interface IUserLoginModel{
    email: string;
    password: string;
    username: string;
    connectionId: string;
}

export class UserLoginModel implements IUserLoginModel{
    email: string;
    password: string;
    username: string;
    connectionId: string;

    constructor(){
        this.email = '';
        this.password = '';
        this.connectionId = '';
        this.username = '';
    }
}