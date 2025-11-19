import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { PosGraduacaoService } from '../../service/posgraduacao.service';
import { ConfirmationService } from 'primeng/api';


@Component({
    templateUrl: './posgraduacao.component.html',
    providers: [MessageService, ConfirmationService]
})
export class PosGraduacaoComponent implements OnInit {

    posForm!: FormGroup;
    posCursos: any[] = []; // lista para exibir pós cadastradas

    constructor(
        private fb: FormBuilder,
        private posService: PosGraduacaoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.posForm = this.fb.group({
            instituicao: ['', Validators.required],
            cidade_estado: ['', Validators.required],
            nome_curso: ['', Validators.required],
            nivel: ['', Validators.required], // lato sensu / stricto sensu
            data_inicio: ['', Validators.required],
            data_fim: ['', Validators.required]
        });

        this.carregarPos(); // carrega pós existentes
    }

    // ----------------------------------------
    // GET – Carregar pós-graduação do usuário
    // ----------------------------------------
    carregarPos() {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;
        this.posService.getPos(id_usuario).subscribe({
            next: (res) => {                
                this.posCursos = res?.dados || [];
            },
            error: () => {                
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar pós-graduação.'
                });
            }
        });
    }

    confirmDelete(id_pos: number) {

    const id_usuario = Number(localStorage.getItem('usuario_id'));
    if (!id_usuario) {
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Usuário não autenticado.'
        });
        return;
    }

    this.confirmationService.confirm({
        message: 'Tem certeza que deseja excluir esta pós-graduação?',
        header: 'Confirmar Exclusão',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {

            this.posService.deletarPos(id_usuario, id_pos).subscribe({
                next: (res) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: res.mensagem
                    });

                    this.carregarPos(); // recarrega tabela
                },
                error: (err) => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: err.error?.erro || 'Não foi possível excluir o registro.'
                    });
                }
            });

        }
    });
}



    // ----------------------------------------
    // POST – Salvar nova pós-graduação
    // ----------------------------------------
    salvarPosGraduacao() {
        if (this.posForm.invalid) {
            alert('Preencha todos os campos obrigatórios.');
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

        const payload = {
            id_usuario,
            ...this.posForm.value
        };

        this.posService.salvarPos(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.posForm.reset();
                this.carregarPos(); // atualiza tabela imediatamente
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

}
