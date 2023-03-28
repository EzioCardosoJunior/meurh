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
 
  constructor(private formBuilder: FormBuilder, private router: Router ) { }

  ngOnInit(): void { 
    
    localStorage.removeItem('token');
    //this.logUser.isAuthenticated() ? alert(22) : alert(44);
        
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


  salvaUsuario() {     
    localStorage.setItem('token', this.cadastroProfissional.value.CampoNome); 
    
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
