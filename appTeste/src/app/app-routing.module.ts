import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './componentes/login/login.component';
const routes: Routes = [
  {
    path:"app-home",
    component: HomeComponent
  },
  {
    path:"app-login",
    component: LoginComponent
  },

  {
    path: '', 
    redirectTo: 'app-login', 
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
