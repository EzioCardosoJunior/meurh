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

  constructor(private router: Router){}

  ngOnInit(): void {
    
    this.primeiroNome = localStorage.getItem('token')

  }

  iniciarConfiguracao(){
    this.router.navigate(['app-cadastro-matriz']);
  }

}
