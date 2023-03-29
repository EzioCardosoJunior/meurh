import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TelaLoginService } from 'src/app/services/tela-login.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  cadastroProfissional: FormGroup; 
 
  constructor( private router: Router, private mostraTela: TelaLoginService ) { }

  ngOnInit(): void { 
    
    localStorage.removeItem('token');
        
    this.cadastroProfissional = new FormGroup({
      campoNome: new FormControl('', Validators.required),
      campoSenha: new FormControl('', Validators.minLength(6)),
      campoConfirmacaoSenha: new FormControl('', Validators.minLength(6)),
      campoEmail: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      campoTermos: new FormControl('', Validators.required)
    })   

  }


  salvaUsuario() {     
    localStorage.setItem('token', this.cadastroProfissional.value.campoNome); 
    
    if (!this.cadastroProfissional.valid) {
      console.log("Formulário inválido");
      return;
    } else if (this.cadastroProfissional.value.campoSenha != this.cadastroProfissional.value.campoConfirmacaoSenha){
      console.log("Senha e confirmação precisam ser iguais");
      return
    }
    console.log(this.cadastroProfissional)
    this.mostraTela.isAuthenticated();
    
  }

}
