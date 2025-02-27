import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { UserLoginModel } from 'src/app/Models/userLoginModel';
import { UserRegisterModel } from 'src/app/Models/userRegisterModel';
import { AuthService } from 'src/app/Services/auth.service';
import { ConnectionService } from 'src/app/Services/connection.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  formulario: FormGroup;
  user: UserLoginModel;
  private connection: HubConnection;

  constructor(private _authService: AuthService, private _conn: ConnectionService, private _router: Router, private _fb: FormBuilder) {
    this.user = new UserLoginModel();
    this.formulario = _fb.group({
      email: [null, Validators.required],
      password: [null, Validators.required],
      username: [null, Validators.required]
    });
    this.connection = new HubConnectionBuilder()
      .withUrl(this._conn.urlHub) // URL del Hub
      .configureLogging(LogLevel.Information)
      .build();
  }

  ngOnInt(){
    this.getConnectionId();
  }

  login() {
    this.user.email = this.formulario.get('email')?.value;
    this.user.password = this.formulario.get('password')?.value;
    this.user.username = this.formulario.get('username')?.value;
    this._authService.login(this.user).subscribe({
      next: (data) => {
        if(data)
          this._router.navigateByUrl('home');
      },
      error: (error) => {
        this._router.navigateByUrl('login');
      }
    })
  }

  get EmailNoValid() {
    return (
      this.formulario?.get('email')?.invalid &&
      this.formulario.get('email')?.touched
    );
  }

  get UserNameNoValid(){
    return (
      this.formulario?.get('username')?.invalid &&
      this.formulario.get('username')?.touched
    );
  }

  get PasswordNoValid() {
    return (
      this.formulario?.get('password')?.invalid &&
      this.formulario.get('password')?.touched
    );
  }

  public startConnection() {
    this.connection.start().then(() => {
      console.log('Connection started');
    }).catch(error => {
      console.error('Error starting connection: ', error);
    });    
  }

  public getConnectionId() {
    this.connection.invoke('GetConnectionId').then(data => {
      this.user.connectionId = data;
    })
  }

}
