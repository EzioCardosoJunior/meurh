import { ContentComponent } from './componentes/content/content.component';
import { BodyComponent } from './componentes/body/body.component';
import { CadastroMatrizComponent } from './componentes/cadastro-matriz/cadastro-matriz.component';
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
    path:"app-cadastro-matriz",
    component: CadastroMatrizComponent
  },
  {
    path:"app-body",
    component: BodyComponent
  },
  {
    path:"app-content",
    component: ContentComponent
  },

  {
    path: '', 
    redirectTo: 'app-home', 
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
