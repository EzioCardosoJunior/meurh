import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmpregosAnterioresService } from '../../service/empregos-anteriores.service';

@Component({
    templateUrl: './empregosanteriores.component.html',
    providers: [MessageService, ConfirmationService]
})
export class EmpregosAnterioresComponent implements OnInit {

    empregoForm!: FormGroup;
    empregos: any[] = []; // lista carregada do backend

    constructor(
        private fb: FormBuilder,
        private empregosService: EmpregosAnterioresService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {

        this.empregoForm = this.fb.group({
            nome_empresa: ['', Validators.required],
            data_entrada: ['', Validators.required],
            data_saida: ['', Validators.required],
            chefe_nome: ['', Validators.required],
            chefe_contato: ['', Validators.required],
            cargo_funcao: ['', Validators.required],
            descricao_atividades: ['', Validators.required],

            // 🔥 NOVO CAMPO
            salario_final: ['', Validators.required]
        });

        this.carregarEmpregos();
    }

    carregarEmpregos() {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.empregosService.getEmpregos(id_usuario).subscribe({
            next: (res) => {
                this.empregos = res?.dados || [];
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar empregos anteriores.'
                });
            }
        });
    }

    salvarEmprego() {
        if (this.empregoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha todos os campos obrigatórios.'
            });
            return;
        }

        const id_usuario = Number(localStorage.getItem('usuario_id'));
        const payload = { id_usuario, ...this.empregoForm.value };

        this.empregosService.salvarEmprego(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.empregoForm.reset();
                this.carregarEmpregos();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar.'
                });
            }
        });
    }

    deleteEmprego(id_registro: number) {
        const id_usuario = Number(localStorage.getItem('usuario_id'));

        this.empregosService.deletarEmprego(id_usuario, id_registro).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.carregarEmpregos();
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

    confirmDelete(id_registro: number) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este registro?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',
            accept: () => this.deleteEmprego(id_registro)
        });
    }
}
