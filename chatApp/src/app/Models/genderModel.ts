export interface IGenderModel {
    id: string;
    description: string;
  }

export class GenderModel implements IGenderModel{
    id: string;
    description: string;

    constructor(){
        this.id = '';
        this.description = '';
    }
}