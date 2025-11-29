import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IdentidadeUsrService } from '../../service/identidade-usr.service';

@Component({
  templateUrl: './identidadeusr.component.html',
  providers: [MessageService]
})
export class IdentidadeUsrComponent implements OnInit {

  identidadeForm!: FormGroup;
  id_usuario = Number(localStorage.getItem('usuario_id'));

  constructor(
    private fb: FormBuilder,
    private identidadeService: IdentidadeUsrService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarDados();
  }

  criarFormulario() {
    this.identidadeForm = this.fb.group({
      email: ['', [Validators.email]],
      receber_vagas: [false],
      nova_senha: [''],
      repetir_senha: [''],
      nome_usuario: [''],

      cpf: [''],
      rg: [''],
      reservista: [''],
      cnh: ['']
    });
  }

  carregarDados() {
    if (!this.id_usuario) return;

    this.identidadeService.getUsuario(this.id_usuario).subscribe({
      next: (res) => {
        if (res?.sucesso && res?.dados) {
          // Preenche os campos retornados (sem sobrescrever campos que não existam)
          this.identidadeForm.patchValue({
            email: res.dados.email ?? '',
            receber_vagas: res.dados.receber_vagas ?? false, // se não existir, fica false
            nome_usuario: res.dados.nome_usuario ?? '',

            cpf: res.dados.cpf ?? '',
            rg: res.dados.rg ?? '',
            reservista: res.dados.reservista ?? '',
            cnh: res.dados.cnh ?? ''
          });

          // NOTA: não preenche senha por segurança
        }
      },
      error: () => {
        // opcional: mostrar mensagem ou silencioso
      }
    });
  }

  salvar() {
    // validação simples: se nova_senha preenchida, repetir_senha deve bater
    const novaSenha = this.identidadeForm.get('nova_senha')?.value;
    const repetirSenha = this.identidadeForm.get('repetir_senha')?.value;
    if (novaSenha && novaSenha !== repetirSenha) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'A nova senha e a repetição não conferem.'
      });
      return;
    }

    const payload = {
      id_usuario: this.id_usuario,
      // apenas enviar campos que importam para update; nome_usuario e email também podem ser atualizados
      email: this.identidadeForm.get('email')?.value,
      nome_usuario: this.identidadeForm.get('nome_usuario')?.value,
      // enviar senha somente se preenchida
      ...(novaSenha ? { senha: novaSenha } : {}),

      cpf: this.identidadeForm.get('cpf')?.value,
      rg: this.identidadeForm.get('rg')?.value,
      reservista: this.identidadeForm.get('reservista')?.value,
      cnh: this.identidadeForm.get('cnh')?.value,
      // se quiser persistir preferência de receber vagas, certifique-se que o backend suporte esse campo
      receber_vagas: this.identidadeForm.get('receber_vagas')?.value
    };

    this.identidadeService.updateUsuario(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Informações atualizadas com sucesso!'
        });

        // recarrega dados do backend (possível que o backend retorne dados atualizados)
        this.carregarDados();
        // limpa campos de senha do formulário por segurança
        this.identidadeForm.patchValue({ nova_senha: '', repetir_senha: '' });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao atualizar os dados.'
        });
      }
    });
  }

  limpar() {
    // Reseta o formulário para os valores iniciais (mantendo o email/nome/receber_vagas caso queira)
    this.identidadeForm.reset({
      email: '',
      receber_vagas: false,
      nova_senha: '',
      repetir_senha: '',
      nome_usuario: '',

      cpf: '',
      rg: '',
      reservista: '',
      cnh: ''
    });

    // Opcional: recarregar dados do servidor imediatamente se quiser restaurar os valores salvos
    // this.carregarDados();
  }
}
