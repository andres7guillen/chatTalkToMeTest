interface IUserRegisterModel {

    email: string;
    password: string;
    name: string;
    surName: string;
    userName: string;
    birthday: Date;
    genderId: string;
    connectionId: string;
}

export class UserRegisterModel implements IUserRegisterModel {
    email: string;
    password: string;
    name: string;
    surName: string;
    userName: string;
    birthday: Date;
    genderId: string;
    connectionId: string;

    constructor(){
        this.email = '';
        this.password = '';
        this.name = '';
        this.surName = '';
        this.userName = '';
        this.birthday = new Date();
        this.genderId = '';
        this.connectionId = '';
    }


}

