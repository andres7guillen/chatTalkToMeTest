interface IFilterModel{
    neighborhood: string;
    locality: string;
    city: string;
    country: string;
    initDate: Date;
    endDate: Date;
    takeItemsList: number;
    userName: string;
}

export class FilterModel implements IFilterModel{
    neighborhood: string;
    locality: string;
    city: string;
    country: string;
    initDate: Date;
    endDate: Date;
    takeItemsList: number; //Range(5, 50
    userName: string;

    constructor(){
        this.city = '';
        this.country = '';
        this.endDate = new Date();
        this.initDate = new Date();
        this.locality = '';
        this.neighborhood = '';
        this.takeItemsList = 0;
        this.userName = '';
    }
}