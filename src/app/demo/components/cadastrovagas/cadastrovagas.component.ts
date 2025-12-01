import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CadastroVagasService } from '../../service/cadastrovagas.service copy';

@Component({
  templateUrl: './cadastrovagas.component.html',
  providers: [MessageService]
})
export class CadastroVagasComponent implements OnInit {

  contaForm!: FormGroup;
  id_usuario = Number(localStorage.getItem('usuario_id'));

  constructor(
    private fb: FormBuilder,
    private cadastroVagas: CadastroVagasService,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
  }




}
