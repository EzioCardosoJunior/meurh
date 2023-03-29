import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './componentes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroMatrizComponent } from './componentes/cadastro-matriz/cadastro-matriz.component';
import { BodyComponent } from './componentes/body/body.component';
import { PerfilEmpresaComponent } from './componentes/perfil-empresa/perfil-empresa.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent,
    CadastroMatrizComponent,
    BodyComponent,
    PerfilEmpresaComponent
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
