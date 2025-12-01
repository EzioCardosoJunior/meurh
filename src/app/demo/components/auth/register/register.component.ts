import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  providers: [MessageService]
})
export class RegisterComponent implements OnInit {

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private layoutService: LayoutService,
    private usuarioService: UsuarioService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({

      // 🟩 Dados pessoais
      nome: [''],
      nome_usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      data_nascimento: [''],

      // 🟩 Documentos
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      rg: [''],
      cnh: [''],
      reservista: [''],

      // 🟩 Dados adicionais
      cnpj: ['', [Validators.pattern(/^\d{14}$/)]],

      // 🟩 Configurações do usuário
      funcao: ['funcionario'],   // default igual ao banco
      status: ['ativo'],         // default igual ao banco

      // 🟩 Senha
      senha: ['', [Validators.required, Validators.minLength(6)]],

      // 🟩 Termos
      termos: [false, Validators.requiredTrue]
    });
  }

  get f() {
    return this.form.controls;
  }

  cadastrar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios corretamente.'
      });
      return;
    }

    const formValue = { ...this.form.value };

    // Remove campos opcionais vazios
    const opcionais = [
      'nome', 'data_nascimento', 'cnpj',
      'rg', 'cnh', 'reservista'
    ];

    opcionais.forEach(c => {
      if (!formValue[c]) delete formValue[c];
    });

    delete formValue.termos; // não vai para o backend

    this.usuarioService.cadastrarUsuario(formValue).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Usuário cadastrado com sucesso!'
        });
        this.form.reset();
      },
      error: (err) => {
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.erro ?? 'Falha ao cadastrar o usuário.'
        });
      }
    });
  }

  get dark(): boolean {
    return this.layoutService.config.colorScheme !== 'light';
  }
}
