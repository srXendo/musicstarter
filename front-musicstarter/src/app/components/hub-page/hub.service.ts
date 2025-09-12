import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HubService {
    constructor(private http: HttpClient){}
    create_hub(){
      return this.http.put(`${environment.api_url}/api/hub`,{},{ withCredentials: true})
    }
    get_hubs(): Observable<any[]>{
      return this.http.get<any[]>(`${environment.api_url}/api/hub`, { withCredentials: true})
    }
}
