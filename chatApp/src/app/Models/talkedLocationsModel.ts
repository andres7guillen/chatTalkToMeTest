interface ITalkedLocations{
    countries: string[];
    cities: string[];
    localities: string[];
    neighborhoods: string[];
}

export class TalkedLocationsModel implements ITalkedLocations{
    countries: string[];
    cities: string[];
    localities: string[];
    neighborhoods: string[];

    constructor(){
        this.cities = [];
        this.countries = [];
        this.localities = [];
        this.neighborhoods = [];
    }
}