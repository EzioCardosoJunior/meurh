import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './componentes/header/header.component';
import { SidebarComponent } from './componentes/sidebar/sidebar.component';
import { FooterComponent } from './componentes/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { ContentComponent } from './componentes/content/content.component';
import { LoginComponent } from './componentes/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroMatrizComponent } from './componentes/cadastro-matriz/cadastro-matriz.component';
import { BodyComponent } from './componentes/body/body.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    HomeComponent,
    ContentComponent,
    LoginComponent,
    CadastroMatrizComponent,
    BodyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
