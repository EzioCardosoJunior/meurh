import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConsultaCepService } from 'src/app/services/consulta-cep.service';


@Component({
  selector: 'app-cadastro-matriz',
  templateUrl: './cadastro-matriz.component.html',
  styleUrls: ['./cadastro-matriz.component.scss']
})
export class CadastroMatrizComponent implements OnInit {

  cadastroEmpresa: FormGroup; 

  constructor(private router: Router, private consultaCepService: ConsultaCepService){}

  ngOnInit(): void {

    this.cadastroEmpresa = new FormGroup({
      tipoEmpresa: new FormControl(''),
      nomeEmpresa: new FormControl('', Validators.required),
      cnpjEmpresa: new FormControl('', Validators.required),
      cep: new FormControl(''),
      endereco: new FormControl(''),
      cidade: new FormControl(''),
      bairro: new FormControl(''),
      estado: new FormControl(''),
      complemento: new FormControl(''),
      celular: new FormControl('', Validators.required),
      nomeAdministrador: new FormControl('', Validators.required),
      cpf: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    
    })

  }

  consultaCep(){
    this.consultaCepService.getConfig(this.cadastroEmpresa.value.cep).subscribe((result: any) => {
      console.log(result)      
    });
  }


  salvarEmpresa() {
    localStorage.setItem('Empresa', JSON.stringify(this.cadastroEmpresa.value))
    console.log(this.cadastroEmpresa)
    this.router.navigate(['app-perfil-empresa']);
  }

}
