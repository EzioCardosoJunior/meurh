import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { TelaLoginService } from 'src/app/services/tela-login.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  constructor(private router: Router, private logUser: TelaLoginService) { }

  verificaLogin: any;
  telaLogin: any;
  telaBody: any;
  larg: any;

  ngOnInit(): void {
   // this.logUser.isAuthenticated() ? alert(22) : alert(44);
   this.logUser.isAuthenticated();

   this.logUser.isAuthenticated() ? (this.verificaLogin = true) && (this.larg="col-9") :
   (this.verificaLogin = false) && (this.larg="col-12")
   
    console.log(this.logUser.isAuthenticated())

  }
}
