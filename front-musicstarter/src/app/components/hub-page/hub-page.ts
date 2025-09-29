import { Component } from '@angular/core';
import { HubService } from './hub.service';
import { BehaviorSubject, map, Observable, of } from 'rxjs';
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
   arr_hubs$ = new BehaviorSubject<any[]>([]);
  constructor(private hubService: HubService, private router: Router){
    this.hubService.get_hubs().subscribe(hubs => {
      this.arr_hubs$.next(hubs);
    });
  }
  create_hub(){
    this.hubService.create_hub().subscribe(res => {
      const current = this.arr_hubs$.getValue();
      this.arr_hubs$.next([...current, res]);
    });
  }
  go_room(id: number){
    this.router.navigate([`/room/${id}`]);
  }
}
