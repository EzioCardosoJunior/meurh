import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/demo/service/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  providers: [MessageService]
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      nome_usuario: ['', Validators.required],
      senha: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.messageService.add({ severity: 'warn', summary: 'Atenção', detail: 'Preencha todos os campos.' });
      return;
    }

    this.loading = true;

    this.authService.loginRequest(this.loginForm.value).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.sucesso) {
          this.messageService.add({ severity: 'success', summary: 'Bem-vindo', detail: res.usuario.nome });
          console.log(res)
          this.router.navigate(['/']); // redireciona à home
        } else {
          this.messageService.add({ severity: 'error', summary: 'Erro', detail: res.erro || 'Credenciais inválidas' });
        }
      },
      error: (err) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err.error?.erro || 'Falha ao conectar ao servidor.'
        });
      }
    });
  }
}
