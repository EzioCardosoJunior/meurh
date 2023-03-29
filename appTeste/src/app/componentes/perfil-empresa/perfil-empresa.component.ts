import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil-empresa',
  templateUrl: './perfil-empresa.component.html',
  styleUrls: ['./perfil-empresa.component.scss']
})
export class PerfilEmpresaComponent implements OnInit{

  dadosEmpresa: any;

  constructor(){}

  ngOnInit(): void {
    const dados:any = localStorage.getItem('Empresa')
    this.dadosEmpresa = JSON.parse(dados);
    console.log(this.dadosEmpresa)
  }

}
