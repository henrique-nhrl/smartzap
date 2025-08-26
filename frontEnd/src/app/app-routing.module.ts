import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { MensagemListComponent } from './components/mensagem-list/mensagem-list.component';
import { MensagemDetailComponent } from './components/mensagem-detail/mensagem-detail.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: "login", component:LoginComponent },
  { path: "registro", component:RegistroComponent },
  {path: "reset-password/:token", component: LoginComponent },
  { path: "mensagens", component:MensagemDetailComponent, canActivate:[AuthGuard] },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
