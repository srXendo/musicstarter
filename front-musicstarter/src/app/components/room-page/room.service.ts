import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ServerEvent {
  event_type: string;
  event_value: any;
}
@Injectable({
  providedIn: 'root'
})
export class RoomService {
  private baseUrl = `${environment.api_url}/api/room`;

  constructor(private http: HttpClient, private zone: NgZone) {}

  // === REST endpoints ===
  addVideo(id_vdo: string, id_room: number | null) {
    return this.http.get(`${this.baseUrl}/add_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }

  pauseVideo(id_vdo: string, id_room: number | null) {
    return this.http.get(`${this.baseUrl}/pause_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }

  playVideo(id_vdo: string, id_room: number | null) {
    return this.http.get(`${this.baseUrl}/play_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }
  previousVideo(id_vdo: string, id_room: number | null){
     return this.http.get(`${this.baseUrl}/previous_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }
  nextVideo(id_vdo: string, id_room: number | null){
     return this.http.get(`${this.baseUrl}/next_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }

  loadVideo(id_vdo: string, id_room: number | null) {
    return this.http.get(`${this.baseUrl}/load_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }

  stopVideo(id_vdo: string, id_room: number | null) {
    return this.http.get(`${this.baseUrl}/stop_video/${id_room}/${id_vdo}`, {withCredentials: true});
  }

  addFriend(email: string) {
    return this.http.post(`${this.baseUrl}/add_friend`, { email }, {withCredentials: true});
  }

  getServerStatus() {
    return this.http.get(`${this.baseUrl}/server`, {withCredentials: true});
  }

  // === SSE con Angular ===
  connectToServerEvents(id_room: any): Observable<ServerEvent> {
    const subject = new Subject<ServerEvent>();
    // 🔄 antes: /tt2
    const source = new EventSource(`${this.baseUrl}/server/${id_room}`, { withCredentials: true });

    source.onmessage = (msg) => {
      console.log('newmsg: ', msg)
      this.zone.run(() => {
        try {
          subject.next(JSON.parse(msg.data));
        } catch (err) {
          console.error('Error parsing SSE message', msg.data);
        }
      });
    };

    source.onerror = (err) => {
      this.zone.run(() => subject.error(err));
    };

    return subject.asObservable();
  }
}
