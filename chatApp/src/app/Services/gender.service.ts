import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ConnectionService } from './connection.service';
import { ApiResponse } from '../Models/ApiResponseModel';
import { GenderModel } from '../Models/genderModel';

@Injectable({
  providedIn: 'root'
})
export class GenderService {
  constructor(private _http:HttpClient, private conn:ConnectionService) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  });

  getGenders(): Observable<ApiResponse<GenderModel[]>> {
    return this._http.get<ApiResponse<GenderModel[]>>(this.conn.urlGender, {
      headers: this.headers
    }).pipe(
      tap(response => console.log('API Response:', response)),
      catchError(error => {
        console.error('API Error:', error);
        return throwError(() => error);
      })
    );
  }


}
