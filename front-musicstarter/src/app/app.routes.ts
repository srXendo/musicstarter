import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { HubPage } from './components/hub-page/hub-page';
import { RoomPage } from './components/room-page/room-page';

export const routes: Routes = [{
  path: 'login',
  component: LoginPage,
}, {
  path: 'hub',
  component: HubPage
}, {
  path: 'room/:id_room',
  component: RoomPage
}];
