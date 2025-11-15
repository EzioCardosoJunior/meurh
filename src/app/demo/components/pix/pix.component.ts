import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PixService } from '../../service/pix.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './pix.component.html',
    providers: [MessageService]
})
export class PixComponent implements OnInit {

    pixForm!: FormGroup;

    constructor(
        private fb: FormBuilder,
        private pixService: PixService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.pixForm = this.fb.group({
            chave_pix: ['', Validators.required],
            titular_nome: ['', Validators.required],
            titular_cpf: ['', Validators.required]
        });
    }

    salvarPix() {
        if (this.pixForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos.'
            });
            return;
        }

        const id_usuario = Number(localStorage.getItem('usuario_id'));

        if (!id_usuario) {
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Usuário não autenticado.'
            });
            return;
        }

        const payload = {
            id_usuario,
            ...this.pixForm.value
        };

        this.pixService.salvarPix(payload).subscribe({
            next: (res) => {
                if (res.sucesso) {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: res.mensagem
                    });
                } else {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: res.erro || 'Erro ao salvar PIX.'
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
