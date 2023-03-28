import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  cadastroProfissional: FormGroup; 
 
  constructor(private formBuilder: FormBuilder, private router: Router) { }

  ngOnInit(): void {      
        
    this.cadastroProfissional = new FormGroup({
      CampoNome: new FormControl('', Validators.required),
      CampoSenha: new FormControl('', ),
      CampoConfirmacaoSenha: new FormControl(''),
      CampoEmail: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      CampoTermos: new FormControl('', Validators.required)
    })   

  }


  teste() {   
    console.log(this.cadastroProfissional.value.CampoSenha)
    if (!this.cadastroProfissional.valid) {
      console.log("Formulário inválido");
      return;
    } else if (this.cadastroProfissional.value.CampoSenha != this.cadastroProfissional.value.CampoConfirmacaoSenha){
      console.log("Senha e confirmação precisam ser iguais");
      return
    }
    console.log(this.cadastroProfissional)
    this.router.navigate(['app-home']);
  }

}
