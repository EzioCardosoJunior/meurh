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
      nome: ['', Validators.required],
      nome_usuario: ['', [Validators.required, Validators.minLength(3)]],
      data_nascimento: ['', Validators.required],
      email: ['', Validators.required],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      cnpj: ['', [Validators.pattern(/^\d{14}$/)]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
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

    const novoUsuario = this.form.value;

    this.usuarioService.cadastrarUsuario(novoUsuario).subscribe({
      next: (res) => {
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
          detail: 'Falha ao cadastrar o usuário. Tente novamente.'
        });
      }
    });
  }

  get dark(): boolean {
    return this.layoutService.config.colorScheme !== 'light';
  }
}



