import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ContaBancariaService } from '../../service/contabancaria.service';

@Component({
  templateUrl: './contabancaria.component.html',
  providers: [MessageService]
})
export class ContaBancariaComponent implements OnInit {

  contaForm!: FormGroup;
  id_usuario = Number(localStorage.getItem('usuario_id'));

  constructor(
    private fb: FormBuilder,
    private contaService: ContaBancariaService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.contaForm = this.fb.group({
      titular_nome: ['', Validators.required],
      titular_sobrenome: ['', Validators.required],
      banco: ['', Validators.required],
      agencia: ['', Validators.required],
      conta: ['', Validators.required]
    });

    this.carregarConta();
  }

  carregarConta() {   

    this.contaService.getConta(this.id_usuario).subscribe({
      next: (res) => {
        if (res && res.conta) {
          this.contaForm.patchValue(res.conta);
        }
      },
      error: () => {
        // Se 404 → não tem conta cadastrada → form vazio mesmo
      }
    });
  }

  salvarConta() {
    if (this.contaForm.invalid) return;
    this.contaService.salvarOuAtualizar(this.id_usuario, this.contaForm.value)
      .subscribe({
        next: (res) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: res?.mensagem || 'Conta salva com sucesso!'
          });
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: err?.error || 'Falha ao salvar.'
          });
        }
      });
  }
}
