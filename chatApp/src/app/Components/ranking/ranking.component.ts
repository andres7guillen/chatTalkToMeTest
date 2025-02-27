import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilterModel } from 'src/app/Models/filterModel';
import { RankingResultModel } from 'src/app/Models/rankingResultModel';
import { TalkedLocationsModel } from 'src/app/Models/talkedLocationsModel';
import { UserService } from 'src/app/Services/user.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html'
})
export class RankingComponent {
  rankingResultModel: RankingResultModel = new RankingResultModel();
  showrankingResult = false;
  filter: FilterModel;
  formulario: FormGroup;
  neighborhoods: string[] = [];
  localities: string[] = [];
  cities: string[] = [];
  countries: string[] = [];

  constructor(private _userService: UserService, private _fb:FormBuilder){
    this.filter = new FilterModel();
    this.formulario = this._fb.group({
      neighborhood: [null],
      locality: [null],
      city: [null],
      country: [null],
      initDate: [null],
      endDate: [null],
      takeItemsList: [null,[Validators.min(5), Validators.max(50)]]
    })
  }

  ngOnInit(): void {
    this.getTalkedLocationsByUserName();
  }

  public getTalkedLocationsByUserName(){
    const userName = localStorage.getItem('userName')!.toString();
    this._userService.getTalkedLocations(userName).subscribe({
      next: (data) => {
        if(data != undefined){
          this.neighborhoods = data[0].neighborhoods;
          this.cities = data[0].cities;
          this.localities = data[0].localities;
          this.countries = data[0].countries;
        }
      },error:(error) => {
        console.log(error)
      }
    })
  }

  public getRanking(){
    this.filter.city = this.formulario.get('city')?.value;
    this.filter.country = this.formulario.get('country')?.value;
    this.filter.endDate = this.formulario.get('endDate')?.value;
    this.filter.initDate = this.formulario.get('initDate')?.value;
    this.filter.locality = this.formulario.get('locality')?.value;
    this.filter.neighborhood = this.formulario.get('neighborhood')?.value;
    this.filter.takeItemsList = this.formulario.get('takeItemsList')?.value;
    this.filter.userName = localStorage.getItem('userName')!.toString();

    this._userService.getRankingByFilter(this.filter).subscribe({
      next: (data) => {
        if(data !== undefined){
          this.showrankingResult = true;
          this.rankingResultModel = data;
        }
      },
      error:(error) => {
        console.log(error);
      }
    })

  }

  get takeItemsListNoValid(){
    return (
      this.formulario?.get('takeItemsList')?.invalid
    );
  }


}
