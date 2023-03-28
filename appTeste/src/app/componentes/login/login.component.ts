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

  constructor(private formBuilder: FormBuilder) { }

  



ngOnInit(): void {
  this.cadastroProfissional = this.formBuilder.group({

    CampoNome: ['', Validators.required],
    CampoSenha: ['', Validators.required],
    CampoConfirmacaoSenha: ['', Validators.required],
    CampoEmail: ['', [
      Validators.required,
      Validators.email
    ]]
  });

  /* this.cadastroProfissional = new FormGroup({
    CampoConfirmacaoSenha: new FormControl(Validators.required),
    CampoNome: new FormControl(),
    CampoSenha: new FormControl(),
    CampoEmail: new FormControl()
  }) */

}

teste(){
  if (!this.cadastroProfissional.valid) {
    console.log("Formulário inválido");
    return;
  }
  console.log(this.cadastroProfissional)
}

}
