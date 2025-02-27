import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConnectionService } from './connection.service';
import { UserRegisterModel } from '../Models/userRegisterModel';
import { Observable, ObservableLike } from 'rxjs';
import { AddCountModel } from '../Models/addCountModel';
import { FilterModel } from '../Models/filterModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private _http:HttpClient, private _conn:ConnectionService) { }

  
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
    "Authorization": "Bearer " + localStorage.getItem('token')
  });

  public addCount(model: AddCountModel): Observable<any>{
    const modelJson = JSON.stringify(model);
    return this._http.post(this._conn.urlUser + 'AddCount', modelJson,{headers: this.headers});
  }

  public getTalkedLocations(userName: string): Observable<any>{
    return this._http.get(this._conn.urlUser + 'GetTalkedLocations/' + userName,{headers: this.headers});
  }

  public getRankingByFilter(model: FilterModel):Observable<any>{
    const modelJson = JSON.stringify(model);
    return this._http.post(this._conn.urlUser + 'GetRankingByFilter',modelJson,{headers: this.headers});
  }

  public getRankingByUserNameAll(userName: string): Observable<any>{
    return this._http.get(this._conn.urlUser + 'GetRankingByUserNameAll/' + userName,{headers: this.headers});
  }

  public getUsersFoundByBluetooth(count: number): Observable<any>{
    return this._http.get(this._conn.urlUser + 'getUsersFoundByBluetooth/' + count, {headers: this.headers});
  }


}
