import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { OrigemUsrService } from '../../service/origem-usr.service';
@Component({
    templateUrl: './origemusr.component.html',
    providers: [MessageService]
})
export class OrigemUsrComponent implements OnInit {

    origemForm!: FormGroup;
    id_usuario = Number(localStorage.getItem('usuario_id'));

    registroOrigem: any[] = []; // tabela recebe array

    constructor(
        private fb: FormBuilder,
        private origemService: OrigemUsrService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit(): void {
        this.criarFormulario();
        this.carregarTabela();
        this.carregarDados();
    }

    criarFormulario() {
        this.origemForm = this.fb.group({
            nacionalidade: ['Brasileiro', Validators.required],
            nascimento_cidade: ['', Validators.required],
            nascimento_estado: ['', Validators.required],
            nascimento_data: ['', Validators.required],
            nome_pai: [''],
            nome_mae: ['']
        });
    }

    carregarTabela() {
        this.origemService.getOrigemCandidato(this.id_usuario).subscribe({
            next: (res) => {
                this.registroOrigem = res ? [res] : [];
            }
        });
    }

    carregarDados() {
        if (!this.id_usuario) return;

        this.origemService.getOrigemCandidato(this.id_usuario).subscribe({
            next: (res) => {
                if (res && res.id) {
                    this.origemForm.patchValue(res);

                    // Desabilita edição
                    this.origemForm.disable();

                    // Guarda ID no form
                    this.origemForm.addControl('id', this.fb.control(res.id));
                }
            }
        });
    }

    salvar() {
        if (this.origemForm.invalid) {
            this.origemForm.markAllAsTouched();
            return;
        }

        this.origemService.salvarOuAtualizar(this.id_usuario, this.origemForm.getRawValue())
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Dados salvos com sucesso!'
                    });

                    this.carregarTabela();
                    this.carregarDados();
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

    /* confirmDelete() {
        this.confirmationService.confirm({
            message: 'Deseja excluir o registro?',
            accept: () => {
                this.excluir();
            }
        });
    } */

   /*  excluir() {
        this.origemService.deleteOrigem(this.id_usuario).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Registro excluído!'
                });

                this.registroOrigem = [];
                this.limpar();
                this.origemForm.enable();
                this.origemForm.removeControl('id');
            }
        });
    } */

    limpar() {
        this.origemForm.reset({
            nacionalidade: 'Brasileiro',
            nascimento_cidade: '',
            nascimento_estado: '',
            nascimento_data: '',
            nome_pai: '',
            nome_mae: ''
        });
    }
}
