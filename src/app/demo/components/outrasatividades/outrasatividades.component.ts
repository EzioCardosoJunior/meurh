import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { OutrasAtividadesService } from '../../service/outras-atividades.service';

@Component({
    templateUrl: './outrasatividades.component.html',
    providers: [MessageService, ConfirmationService]
})
export class OutrasAtividadesComponent implements OnInit {

    atividadeForm!: FormGroup;
    atividades: any[] = []; // lista carregada do backend

    constructor(
        private fb: FormBuilder,
        private atividadesService: OutrasAtividadesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.atividadeForm = this.fb.group({
            breve_descricao: ['', Validators.required],
            data_realizacao: ['', Validators.required],
            duracao: ['', Validators.required],
            nome_empresa_cliente: ['', Validators.required],
            telefone_contato: ['', Validators.required]
        });

        this.carregarAtividades();
    }

    // -------------------------------
    // GET - Carregar atividades
    // -------------------------------
    carregarAtividades() {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.atividadesService.getAtividades(id_usuario).subscribe({
            next: (res) => {
                this.atividades = res?.dados || [];
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar atividades.'
                });
            }
        });
    }

    // -------------------------------
    // POST - Salvar nova atividade
    // -------------------------------
    salvarAtividade() {
        if (this.atividadeForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios.'
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

        const payload = { id_usuario, ...this.atividadeForm.value };

        this.atividadesService.salvarAtividade(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.atividadeForm.reset();
                this.carregarAtividades();
            },
            error: (err) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: err.error?.erro || 'Falha ao salvar.'
                });
            }
        });
    }

    // -------------------------------
    // DELETE - Remover atividade
    // -------------------------------
    deleteAtividade(id_registro: number) {
        this.atividadesService.deleteAtividade(id_registro).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: res.status,
                    summary: res.status === 'success' ? 'Sucesso' : 'Atenção',
                    detail: res.mensagem
                });

                if (res.status === 'success') {
                    this.carregarAtividades();
                }
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível excluir a atividade.'
                });
            }
        });
    }


    // -------------------------------
    // CONFIRM - Modal de exclusão
    // -------------------------------
    confirmDelete(id_registro: number) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir esta atividade?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',

            accept: () => {
                this.deleteAtividade(id_registro);
            },

            reject: () => {
                this.messageService.add({
                    severity: 'info',
                    summary: 'Cancelado',
                    detail: 'A exclusão foi cancelada.'
                });
            }
        });
    }
}
