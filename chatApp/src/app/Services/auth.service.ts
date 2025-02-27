import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs'
import { ConnectionService } from './connection.service';
import { UserLoginModel } from '../Models/userLoginModel';
import { UserRegisterModel } from '../Models/userRegisterModel';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _http: HttpClient, private _connctionService: ConnectionService) { }

  userToken: string = '';
  userName: string = '';
  email: string = '';
  isAuthenticated: boolean = false;

  private headers = new HttpHeaders({
    'Content-type': 'application/json',
    "Authorization": "Bearer " + localStorage.getItem('token')
  });

  private saveToken(token: string) {
    this.userToken = token;
    localStorage.setItem('token', token);
  }

  private saveUserName(userName: string) {
    localStorage.setItem('userName', userName);
  }

  private readUserName(): string {
    if (localStorage.getItem('userName')) {
      this.userName = localStorage.getItem('userName')!.toString();
    } else {
      this.userName = '';
    }
    return this.userName;
  }

  private saveEmail(email: string) {
    localStorage.setItem('email', email);
  }

  private readEmail(): string {
    if (localStorage.getItem('email')) {
      this.email = localStorage.getItem('email')!.toString();
    } else {
      this.email = '';
    }
    return this.email;
  }

  private readToken(): string {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token')!.toString();
    } else {
      this.userToken = '';
    }
    return this.userToken;
  }

  login(usuario: UserLoginModel): Observable<any> {
    return this._http.post(this._connctionService.urlUser + 'Login', JSON.stringify(usuario), { headers: this.headers })
      .pipe(
        map((resp: any) => {
          this.saveToken(resp.data.token);
          this.saveEmail(resp.data.emailUser);
          this.saveUserName(resp.data.userName);
          this.isAuthenticated = true;
          return resp;
        })
      )
  }

  logOut() {
    localStorage.removeItem('token');
  }

  registerUser(usuario: UserRegisterModel) {
    return this._http.post(this._connctionService.urlUser + 'register', JSON.stringify(usuario), { headers: this.headers })
      .pipe(
        map((resp: any) => {
          console.log(resp);
          this.saveToken(resp.data.token);
          this.saveEmail(resp.data.emailUser);
          this.saveUserName(resp.data.userName);
          return resp;
        })
      )
  }
}
