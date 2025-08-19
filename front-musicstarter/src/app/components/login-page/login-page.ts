import { Component } from '@angular/core';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login-page',
  imports: [],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  constructor(private loginSerivice: LoginService){}
  login_temporal_user(){
    this.loginSerivice.login_temporal_user().subscribe({
      next: (res: unknown)=>{
        console.log(res)
      },
      error: (err: any)=>{
        console.error(err)
        console.error(new Error(err.stack))
      }
    })
  }
}
