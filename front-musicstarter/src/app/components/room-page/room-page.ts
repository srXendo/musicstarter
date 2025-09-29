import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoomService, ServerEvent } from './room.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-room-page',
  imports: [FormsModule],
  templateUrl: './room-page.html',
  styleUrl: './room-page.css'
})
export class RoomPage implements OnInit, OnDestroy {
  id_room: number | null = null
  @ViewChild('youtubeFrame') youtubeFrame!: ElementRef<HTMLIFrameElement>;

  inputYoutube = '';
  currentVideoId: string | null = null;
  videos: string[] = [];
  private sseSub?: Subscription;

  constructor(private route: ActivatedRoute, private roomService: RoomService){
    const param = this.route.snapshot.paramMap.get('id_room')
    if(!!param){
      this.id_room = parseInt(param);
    }
  }
  ngOnInit(): void {

    // Suscripción a eventos SSE
    this.sseSub = this.roomService.connectToServerEvents(this.id_room).subscribe({
      next: (event) => this.handleServerEvent(event),
      error: (err) => console.error('SSE error', err)
    });
  }

  ngOnDestroy(): void {
    this.sseSub?.unsubscribe();
  }

  // === Handlers de eventos SSE (antes EVENTS_TYPES) ===
  private handleServerEvent(event: ServerEvent) {
    switch (event.event_type) {
      case 'load_video':
        this.recive_loading(event.event_value);
        break;
      case 'print_list_video':
        this.videos = event.event_value;
        break;
      case 'add_video':
        this.setYoutubeSrc(event.event_value);
        break;
      case 'pause_video':
        this.sendCommandFrame('pauseVideo');
        break;
      case 'play_video':
        this.sendCommandFrame('playVideo');
        break;
      case 'stop_video':
        this.sendCommandFrame('stopVideo');
        break;
      case 'friend_list':
        console.log('Friend list:', event.event_value);
        break;
      case 'execute_event':
        this.handleServerEvent(event.event_value);
        break;
      default:
        console.warn('Evento desconocido', event);
    }
  }

  // === Métodos usados por botones ===
  addNewVideo() {
    const id = this.extractVideoId(this.inputYoutube);
    if (!id) {
      alert('La URL no tiene parámetro ?v=');
      return;
    }
    this.roomService.addVideo(id, this.id_room).subscribe(() => {
      this.setYoutubeSrc(id);
      if (!this.videos.includes(id)) this.videos.push(id);
    });
  }

  pauseVideo() {
    if (this.currentVideoId) {
      this.roomService.pauseVideo(this.currentVideoId, this.id_room).subscribe();
      this.sendCommandFrame('pauseVideo');
    }
  }

  playVideo() {
    if (this.currentVideoId) {
      this.roomService.playVideo(this.currentVideoId, this.id_room).subscribe();
      this.sendCommandFrame('playVideo');
    }
  }

  stopVideo() {
    if (this.currentVideoId) {
      this.roomService.stopVideo(this.currentVideoId, this.id_room).subscribe();
      this.sendCommandFrame('stopVideo');
    }
  }

  loadVideo(id: string) {
    this.currentVideoId = id;
    this.roomService.loadVideo(id, this.id_room).subscribe();

  }
  recive_loading(id: string){
    this.setYoutubeSrc(id);
    this.sendCommandFrame('playVideo');
  }
  previousVideo(){
    if (this.currentVideoId) {
      this.roomService.previousVideo(this.currentVideoId, this.id_room).subscribe();

    }    
  }
  nextVideo(){
    if (this.currentVideoId) {
      this.roomService.nextVideo(this.currentVideoId, this.id_room).subscribe();
    }    
  }
  addFriend() {
    const email = prompt('Introduce el email de tu amigo');
    if (email) {
      this.roomService.addFriend(email).subscribe();
    }
  }

  // === Helpers internos ===
  private extractVideoId(url: string): string | null {
    try {
      const params = new URL(url).searchParams;
      return params.get('v');
    } catch {
      return null;
    }
  }

  private setYoutubeSrc(id: string) {
    this.currentVideoId = id;
    this.youtubeFrame.nativeElement.src = `https://www.youtube.com/embed/${id}?enablejsapi=1`;
    console.log('set youtube src')
  }

  private sendCommandFrame(command: string) {
    this.youtubeFrame.nativeElement.contentWindow?.postMessage(
      JSON.stringify({ event: 'command', func: command, args: '' }),
      '*'
    );
  }
}
