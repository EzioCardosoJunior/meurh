import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OutrosCursosService } from '../../service/outros-cursos.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    templateUrl: './outroscursos.component.html',
    providers: [MessageService]
})
export class OutrosCursosComponent implements OnInit {

    cursoForm!: FormGroup;
    cursos: any[] = []; // lista carregada do backend

    constructor(
        private fb: FormBuilder,
        private cursoService: OutrosCursosService,
        private messageService: MessageService, private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.cursoForm = this.fb.group({
            nome_curso: ['', Validators.required],
            instituicao: ['', Validators.required],
            tipo_certificado: ['', Validators.required],
            duracao_horas: [''],
            duracao_meses: ['']
        });

        this.carregarCursos();
    }

    // -------------------------------
    // GET - Carregar cursos do usuário
    // -------------------------------
    carregarCursos() {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.cursoService.getCursos(id_usuario).subscribe({
            next: (res) => {
                this.cursos = res?.dados || [];
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar cursos.'
                });
            }
        });
    }

    // -------------------------------
    // POST - Salvar novo curso
    // -------------------------------
    salvarCurso() {
        if (this.cursoForm.invalid) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Preencha os campos obrigatórios.'
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

        const payload = { id_usuario, ...this.cursoForm.value };

        this.cursoService.salvarCurso(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.cursoForm.reset();
                this.carregarCursos(); // Atualiza lista
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
    // DELETE - Remover curso
    // -------------------------------
    deleteCurso(id_curso: number) {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.cursoService.deleteCurso(id_usuario, id_curso).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.carregarCursos(); // Atualiza tabela após remover
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Não foi possível excluir o curso.'
                });
            }
        });
    }

    confirmDelete(cursoId: number) {
        this.confirmationService.confirm({
            message: 'Tem certeza que deseja excluir este curso?',
            header: 'Confirmar Exclusão',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sim',
            rejectLabel: 'Cancelar',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-secondary',

            accept: () => {
                this.deleteCurso(cursoId);  // sua função real
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
