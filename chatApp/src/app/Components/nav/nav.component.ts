import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {
  estaLogueado:boolean = true;
  constructor(private _authService: AuthService, private router:Router){}

  ngOnInit(): void {
    this.estaLogueado = this._authService.isAuthenticated;
    console.log('esta logueado:',this.estaLogueado);
  }

  salir(){    
    this._authService.logOut();
    this.router.navigateByUrl('/login');
  }
}
