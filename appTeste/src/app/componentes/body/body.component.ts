import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.scss']
})
export class BodyComponent implements OnInit {

  constructor(private router: Router) { }

  verificaLogin: any = 1
  telaLogin: any;
  telaBody: any;
  larg: any;

  ngOnInit(): void {
    console.log(location.pathname)
    location.pathname == "/app-login" ? (this.telaLogin = true) && (this.telaBody = false) : (this.telaBody = true) && (this.larg = "col-9");
  } 

}
