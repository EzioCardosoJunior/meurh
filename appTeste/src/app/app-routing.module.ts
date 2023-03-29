import { BodyComponent } from './componentes/body/body.component';
import { CadastroMatrizComponent } from './componentes/cadastro-matriz/cadastro-matriz.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { PerfilEmpresaComponent } from './componentes/perfil-empresa/perfil-empresa.component';
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
    path:"app-perfil-empresa",
    component: PerfilEmpresaComponent
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
