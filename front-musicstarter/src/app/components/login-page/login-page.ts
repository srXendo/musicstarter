import { Component } from '@angular/core';
import { LoginService } from './login.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css'
})
export class LoginPage {
  error_login_temporal_user: boolean = false;
  error_login_user: boolean = false;
  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  })
  constructor(private loginSerivice: LoginService){}
  login_temporal_user(){
    this.loginSerivice.login_temporal_user().subscribe({
      next: (res: unknown)=>{
        console.log(res)
      },
      error: (err: any)=>{
        console.error(err)
        console.error(new Error(err.stack))
        this.error_login_temporal_user = true
      }
    })
  }
  login_user(){
    this.error_login_user = true
  }
}
