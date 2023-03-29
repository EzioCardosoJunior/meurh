import { Component, OnInit } from '@angular/core';
import { TelaLoginService } from './services/tela-login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'appTesteRH';

  mostraSb: boolean = false;

  constructor(private mostraMenu: TelaLoginService){};

  ngOnInit() {  
    this.mostraMenu.mostraSidebar.subscribe(
      mostra => this.mostraSb = mostra
      );
      console.log(this.mostraSb)

  } 

}
