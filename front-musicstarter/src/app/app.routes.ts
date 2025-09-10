import { Routes } from '@angular/router';
import { LoginPage } from './components/login-page/login-page';
import { HubPage } from './components/hub-page/hub-page';

export const routes: Routes = [{
  path: 'login',
  component: LoginPage,
}, {
  path: 'hub',
  component: HubPage
}];
