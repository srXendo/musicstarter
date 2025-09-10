import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from './../../../environments/environment'
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  constructor(private http: HttpClient){}
  login_temporal_user():Observable<any>{
    console.log(environment)
    return this.http.post(`${environment.api_url}/api/login/temporal`, {}, { withCredentials: true })
  }
  login_user(obj: any){
    console.log(obj)
    return this.http.post(`${environment.api_url}/api/login`, obj, { withCredentials: true})
  }
}
