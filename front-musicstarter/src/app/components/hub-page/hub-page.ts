import { Component } from '@angular/core';
import { HubService } from './hub.service';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-hub-page',
  imports: [CommonModule],
  templateUrl: './hub-page.html',
  styleUrl: './hub-page.css'
})
export class HubPage {
  error_create: boolean = false;
  arr_hubs$: Observable<any[]>;
  constructor(private hubService: HubService, private router: Router){
    this.arr_hubs$ = this.hubService.get_hubs()
  }
  create_hub(){
    this.hubService.create_hub().subscribe(res=>{
      console.log(res)
      this.error_create = true
    })
  }
  go_room(id: number){
    this.router.navigate([`/room/${id}`]);
  }
}
