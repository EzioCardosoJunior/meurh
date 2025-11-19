import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { TecnicoGradService } from '../../service/tecnico-grad.service';

@Component({
    templateUrl: './graduacaoetecnico.component.html',
    providers: [MessageService, ConfirmationService]
})
export class GraduacaoTecnicoComponent implements OnInit {

    tecnicoForm!: FormGroup;
    registros: any[] = []; // lista com graduações/técnicos salvos

    constructor(
        private fb: FormBuilder,
        private tecnicoGradService: TecnicoGradService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.tecnicoForm = this.fb.group({
            instituicao_nome: ['', Validators.required],
            cidade_estado: ['', Validators.required],
            curso_nome: ['', Validators.required],
            nivel: ['', Validators.required], // Técnico / Graduação / Bacharelado / Licenciatura
            data_inicio: ['', Validators.required],
            data_fim: ['', Validators.required],
            status: ['', Validators.required] // concluído / cursando / trancado
        });

        this.carregarRegistros();
    }

    // ----------------------------------------
    // GET – Buscar registros
    // ----------------------------------------
    carregarRegistros() {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.tecnicoGradService.getTecnicoGrad(id_usuario).subscribe({
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

    // ----------------------------------------
    // POST – Salvar registro
    // ----------------------------------------
    salvarTecnicoGrad() {
        if (this.tecnicoForm.invalid) {
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
            ...this.tecnicoForm.value
        };

        this.tecnicoGradService.salvarTecnicoGrad(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });
                this.tecnicoForm.reset();
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

    // ----------------------------------------
    // DELETE – Confirmar e excluir
    // ----------------------------------------
    confirmDelete(id_registro: number) {
        const id_usuario = Number(localStorage.getItem('usuario_id'));

        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este registro?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {

                this.tecnicoGradService.deleteTecnicoGrad(id_usuario, id_registro).subscribe({
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
