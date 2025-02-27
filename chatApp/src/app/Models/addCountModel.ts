interface IAddCountModel{
    userNameUserTalked: string;
    emailUserWhoTalk: string;
    latitude: number;
    longitude: number;
}

export class AddCountModel implements IAddCountModel{
    userNameUserTalked: string;
    emailUserWhoTalk: string;
    latitude: number;
    longitude: number;

    constructor(){
        this.emailUserWhoTalk = '';
        this.latitude = 0;
        this.longitude = 0;
        this.userNameUserTalked = '';
    }
}