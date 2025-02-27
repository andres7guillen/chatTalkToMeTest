interface IUserRankingModel{
    email: string;
    name: string;
    surName: string;
    countTalked: number;
    gender: string;
    userName: string;
    position: number;
    profileId: string;
    profilePhoto: string;
    photoOfTheDay: string;
}

export class UserRankingModel implements IUserRankingModel{
    email: string = '';
    name: string = '';
    surName: string ='';
    countTalked: number = 0;
    gender: string = '';
    userName: string = '';
    position: number = 0;
    profileId: string = '';
    profilePhoto: string = '';
    photoOfTheDay: string = '';
}