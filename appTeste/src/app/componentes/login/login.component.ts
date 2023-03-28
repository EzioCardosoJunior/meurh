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

    /* this.cadastroProfissional = this.formBuilder.group({
      CampoNome: ['', Validators.required],
      CampoSenha: ['', Validators.minLength(6)],
      CampoConfirmacaoSenha: ['', Validators.minLength(2)],
      CampoEmail: ['', [
        Validators.required,
        Validators.email
      ]]
    });
   */
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

    function passwordMatchValidator(g: FormGroup) {
      console.log(g)
      /* return g.get('CampoSenha').value === g.get('passwordConfirm').value
        ? null : { 'mismatch': true }; */
    }

  }


  teste() {   
    if (!this.cadastroProfissional.valid) {
      console.log("Formulário inválido");
      return;
    }
    console.log(this.cadastroProfissional)
  }

}
