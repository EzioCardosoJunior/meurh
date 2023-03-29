import { TelaLoginService } from 'src/app/services/tela-login.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  primeiroNome: any;

  constructor(private router: Router, private mostraTela: TelaLoginService){}

  ngOnInit(): void {
    this.mostraTela.isAuthenticated();
    this.primeiroNome = localStorage.getItem('token')

  }

  iniciarConfiguracao(){
    this.router.navigate(['app-cadastro-matriz']);
  }

}
