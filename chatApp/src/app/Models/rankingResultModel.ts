import { UserRankingModel } from "./UserRankingModel";

interface IRankingResultModel{
    position: number;
    users: UserRankingModel[];
}

export class RankingResultModel implements IRankingResultModel{
    position: number = 0;
    users: UserRankingModel[] = []; 
}