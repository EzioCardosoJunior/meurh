import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IdentidadeUsrService } from '../../service/identidade-usr.service';
import { PhotoService } from '../../service/photo.service';

@Component({
  templateUrl: './identidadeusr.component.html',
  providers: [MessageService]
})
export class IdentidadeUsrComponent implements OnInit {

  identidadeForm!: FormGroup;
  id_usuario = Number(localStorage.getItem('usuario_id'));

  // FOTO PADRÃO
  fotoUrl: string = 'assets/layout/images/semusuario.png';

  @ViewChild('inputFoto') inputFoto!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private identidadeService: IdentidadeUsrService,
    private messageService: MessageService,
    private photoService: PhotoService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
    this.carregarDados();
    this.carregarFoto();
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
          this.identidadeForm.patchValue(res.dados);
        }
      }
    });
  }

  carregarFoto() {
    this.photoService.getFotoUsuario(this.id_usuario).subscribe({
      next: (res) => {

        if (res?.foto_url) {
          
          // URL COMPLETA ABSOLUTA + cache-buster
          this.fotoUrl =
            'https://tendapromos.com.br/servicoscurr/' +
            res.foto_url +
            '?t=' +
            new Date().getTime();
        }
      }
    });
  }

  selecionarArquivo() {
    this.inputFoto.nativeElement.click();
  }

  uploadFoto(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.photoService.uploadFotoUsuario(this.id_usuario, file).subscribe({
      next: (res) => {

        // URL COMPLETA ABSOLUTA + cache-buster
        this.fotoUrl =
          'https://tendapromos.com.br/servicoscurr/' +
          res.foto_url +
          '?t=' +
          new Date().getTime();

        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Foto atualizada!'
        });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao fazer upload da foto.'
        });
      }
    });
  }

  salvar() {
    const novaSenha = this.identidadeForm.get('nova_senha')?.value;
    const repetirSenha = this.identidadeForm.get('repetir_senha')?.value;

    if (novaSenha && novaSenha !== repetirSenha) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'As senhas não conferem.'
      });
      return;
    }

    const payload = {
      id_usuario: this.id_usuario,
      email: this.identidadeForm.get('email')?.value,
      nome_usuario: this.identidadeForm.get('nome_usuario')?.value,
      ...(novaSenha ? { senha: novaSenha } : {}),
      cpf: this.identidadeForm.get('cpf')?.value,
      rg: this.identidadeForm.get('rg')?.value,
      reservista: this.identidadeForm.get('reservista')?.value,
      cnh: this.identidadeForm.get('cnh')?.value,
      receber_vagas: this.identidadeForm.get('receber_vagas')?.value
    };

    this.identidadeService.updateUsuario(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Informações atualizadas!'
        });
      }
    });
  }

  limpar() {
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
  }

}
