import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { FundamentalMedioService } from '../../service/fundamental-medio.service';

@Component({
    templateUrl: './fundamentalemedio.component.html',
    providers: [MessageService, ConfirmationService]
})
export class FundamentalMedioComponent implements OnInit {

    ensinoForm!: FormGroup;
    registros: any[] = [];

    constructor(
        private fb: FormBuilder,
        private fundMedService: FundamentalMedioService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.ensinoForm = this.fb.group({
            fundamental_instituicao: ['', Validators.required],
            fundamental_ano_conclusao: ['', Validators.required],
            medio_instituicao: ['', Validators.required],
            medio_ano_conclusao: ['', Validators.required]
        });

        this.carregarRegistros();
    }

    carregarRegistros() {
        console.log('Carregando registros de ensino fundamental e médio');
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.fundMedService.getFundMedio(id_usuario).subscribe({
            next: (res) => {
                this.registros = res?.dados || [];
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar registros.'
                });
            }
        });
    }

    salvarEnsino() {
        if (this.ensinoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios.'
            });
            return;
        }

        const id_usuario = Number(localStorage.getItem('usuario_id'));

        const payload = {
            id_usuario,
            ...this.ensinoForm.value
        };

        this.fundMedService.salvarFundMedio(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });
                this.ensinoForm.reset();
                this.carregarRegistros();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível salvar o registro.'
                });
            }
        });
    }

    confirmDelete(id: number) {
        const id_usuario = Number(localStorage.getItem('usuario_id'));

        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este registro?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.fundMedService.deletarFundMedio(id_usuario, id).subscribe({
                    next: (res) => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Sucesso',
                            detail: res.mensagem
                        });
                        this.carregarRegistros();
                    },
                    error: () => {
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Erro',
                            detail: 'Não foi possível excluir o registro.'
                        });
                    }
                });
            }
        });
    }
}
