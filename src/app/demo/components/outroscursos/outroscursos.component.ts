import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { OutrosCursosService } from '../../service/outros-cursos.service';

@Component({
    templateUrl: './outroscursos.component.html',
    providers: [MessageService]
})
export class OutrosCursosComponent implements OnInit {

    cursoForm!: FormGroup;
    cursos: any[] = []; // ← lista de cursos carregados

    constructor(
        private fb: FormBuilder,
        private cursoService: OutrosCursosService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.cursoForm = this.fb.group({
            nome_curso: ['', Validators.required],
            instituicao: ['', Validators.required],
            tipo_certificado: ['', Validators.required],
            duracao_horas: [''],
            duracao_meses: ['']
        });

        this.carregarCursos(); // ← carrega lista ao iniciar
    }

    // -------------------------------
    // GET - Carregar cursos do usuário
    // -------------------------------
    carregarCursos() {
    const id_usuario = Number(localStorage.getItem('usuario_id'));
    if (!id_usuario) return;

    this.cursoService.getCursos(id_usuario).subscribe({
        next: (res) => {
            this.cursos = res ? res.dados : [];
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

        const payload = {
            id_usuario,
            ...this.cursoForm.value
        };

        this.cursoService.salvarCurso(payload).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: res.mensagem
                });

                this.cursoForm.reset();
                this.carregarCursos(); // ← atualiza lista imediatamente
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
