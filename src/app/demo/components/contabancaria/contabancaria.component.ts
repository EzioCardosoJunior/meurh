import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PixService } from '../../service/pix.service';
import { MessageService } from 'primeng/api';
import { ContaBancariaService } from '../../service/contabancaria.service';

@Component({
  templateUrl: './contabancaria.component.html',
  providers: [MessageService]
})
export class ContaBancariaComponent implements OnInit {

  contaForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contaService: ContaBancariaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.contaForm = this.fb.group({
      nome: ['', Validators.required],
      sobrenome: ['', Validators.required],
      banco: ['', Validators.required],
      agencia: ['', Validators.required],
      conta: ['', Validators.required]
    });
  }

  salvarConta() {
    alert(1);   

    if (this.contaForm.invalid) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.'
      });
      return;
    }

    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      this.messageService.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Usuário não autenticado.'
      });
      return;
    }

    const { id } = JSON.parse(usuario);

    const payload = {
      id_usuario: id,
      ...this.contaForm.value
    };

    this.contaService.salvarConta(payload).subscribe({
      next: (res) => {
        if (res.sucesso) {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: res.mensagem
          });

          this.contaForm.reset();
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: res.erro || 'Erro ao salvar conta bancária.'
          });
        }
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.erro || 'Falha na comunicação.'
        });
      }
    });

  }

}
