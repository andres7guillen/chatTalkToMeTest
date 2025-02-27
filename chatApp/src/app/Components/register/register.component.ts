import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GenderModel } from 'src/app/Models/genderModel';
import { UserRegisterModel } from 'src/app/Models/userRegisterModel';
import { GenderService } from 'src/app/Services/gender.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/Services/auth.service';
import { ConnectionService } from 'src/app/Services/connection.service';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  genders:GenderModel[];
  user: UserRegisterModel;
  formulario: FormGroup;

  constructor(private _conn: ConnectionService, private _userService: AuthService, private _genderService:GenderService, private _router:Router, private _fb:FormBuilder){

    this.genders = [];
    this.user = new UserRegisterModel();
    this.formulario = this._fb.group({
      email: new FormControl('', Validators.email),
      password: [null, Validators.required],
      name: [null, Validators.maxLength(200)],
      surname: [null, Validators.required],
      username: [null, Validators.required],
      birthday:[null, Validators.required],
      gender: [null,Validators.required]
    });
  }

  ngOnInit(){
    this.getGenders();
  }
  
  getGenders(){
    this._genderService.getGenders().subscribe({
      next: (data) => {
        if(data !== undefined){
          this.genders = data.data;
        }
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  Create() {
    if (this.formulario.valid) {
      this.user.genderId = this.formulario.get('gender')?.value;
      this.user.birthday = this.formulario.get('birthday')?.value;
      this.user.email = this.formulario.get('email')?.value;
      this.user.name = this.formulario.get('name')?.value;
      this.user.password = this.formulario.get('password')?.value;
      this.user.surName = this.formulario.get('surname')?.value;
      this.user.userName = this.formulario.get('username')?.value;
      
      this._userService.registerUser(this.user)
        .subscribe({
          next: (data) => {
            alert('User: ' + data.name + ' was registered');
            this._router.navigateByUrl('login');
          }
        });
    }
  }
  
  get EmailNoValid() {
    return (
      this.formulario?.get('email')?.invalid &&
      this.formulario.get('email')?.touched
    );
  }

  get PasswordNoValid() {
    return (
      this.formulario?.get('password')?.invalid &&
      this.formulario.get('password')?.touched
    );
  }

  get UserNameNoValid() {
    return (
      this.formulario?.get('username')?.invalid &&
      this.formulario.get('username')?.touched
    );
  }

  get SurNameNoValid() {
    return (
      this.formulario?.get('surname')?.invalid &&
      this.formulario.get('surname')?.touched
    );
  }

  get NameNoValid() {
    return (
      this.formulario?.get('name')?.invalid &&
      this.formulario.get('name')?.touched
    );
  }

  get BirthdayNoValid() {
    return (
      this.formulario?.get('birthday')?.invalid &&
      this.formulario.get('birthday')?.touched
    );
  }

  get GenderNoValid() {
    return (
      this.formulario?.get('gender')?.invalid &&
      this.formulario.get('gender')?.touched
    );
  }
}
