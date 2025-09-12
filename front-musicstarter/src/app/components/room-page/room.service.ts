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
  addVideo(id: string) {
    return this.http.get(`${this.baseUrl}/add_video/${id}`, {withCredentials: true});
  }

  pauseVideo(id: string) {
    return this.http.get(`${this.baseUrl}/pause_video/${id}`, {withCredentials: true});
  }

  playVideo(id: string) {
    return this.http.get(`${this.baseUrl}/play_video/${id}`, {withCredentials: true});
  }

  loadVideo(id: string) {
    return this.http.get(`${this.baseUrl}/load_video/${id}`, {withCredentials: true});
  }

  stopVideo(id: string) {
    return this.http.get(`${this.baseUrl}/stop_video/${id}`, {withCredentials: true});
  }

  addFriend(email: string) {
    return this.http.post(`${this.baseUrl}/add_friend`, { email }, {withCredentials: true});
  }

  getServerStatus() {
    return this.http.get(`${this.baseUrl}/server`, {withCredentials: true});
  }

  // === SSE con Angular ===
  connectToServerEvents(): Observable<ServerEvent> {
    const subject = new Subject<ServerEvent>();
    // 🔄 antes: /tt2
    const source = new EventSource(`${this.baseUrl}/server`, { withCredentials: true });

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
