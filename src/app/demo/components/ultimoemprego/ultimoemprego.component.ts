import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UltimoEmpregoService } from '../../service/ultimo-emprego.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

@Component({
    templateUrl: './ultimoemprego.component.html',
    providers: [MessageService]
})
export class UltimoEmpregoComponent implements OnInit {

    empregoForm!: FormGroup;
    id_usuario = Number(localStorage.getItem('usuario_id'));
    registroEmprego: any[] | null = null;

    constructor(
        private fb: FormBuilder,
        private empregoService: UltimoEmpregoService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    ngOnInit(): void {
        this.carregarTabela();

        // FORM ATUALIZADO COM SALÁRIO
        this.empregoForm = this.fb.group({
            empresa: ['', Validators.required],
            funcao: ['', Validators.required],
            data_entrada: ['', Validators.required],
            data_termino: [''],
            atual: [false],
            atividades: [''],
            salario_atual: [null] // CAMPO NOVO
        });

        this.monitorarEmpregoAtual();
        this.carregarDados();
    }

    carregarTabela() {
        this.empregoService.getUltimoEmprego(this.id_usuario).subscribe({
            next: (res) => {
                if (res) {
                    this.registroEmprego = [res.dados];
                } else {
                    this.registroEmprego = [];
                }
            }
        });
    }

    monitorarEmpregoAtual() {
        this.empregoForm.get('atual')?.valueChanges.subscribe((value) => {
            const dtTermino = this.empregoForm.get('data_termino');

            if (value) {
                dtTermino?.disable();
                dtTermino?.setValue('');
            } else {
                dtTermino?.enable();
            }
        });
    }

    carregarDados() {
        if (!this.id_usuario) return;

        this.empregoService.getUltimoEmprego(this.id_usuario).subscribe({
            next: (res) => {
                if (res?.id) {

                    // PATCH DO FORM INCLUINDO SALÁRIO
                    this.empregoForm.patchValue({
                        empresa: res.empresa,
                        funcao: res.funcao,
                        data_entrada: res.data_entrada,
                        data_termino: res.data_termino,
                        atual: res.atual,
                        atividades: res.atividades,
                        salario_atual: res.salario_atual // NOVO CAMPO
                    });

                    // DESABILITA CAMPOS
                    this.empregoForm.disable();

                    // Fazer botão de excluir funcionar
                    if (!this.empregoForm.contains('id')) {
                        this.empregoForm.addControl('id', this.fb.control(res.id));
                    }
                }
            }
        });
    }

    salvar() {
        if (this.empregoForm.invalid) {
            this.empregoForm.markAllAsTouched();
            return;
        }

        this.empregoService
            .salvarOuAtualizar(this.id_usuario, this.empregoForm.getRawValue())
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Dados do emprego salvos com sucesso!'
                    });
                    this.carregarDados();
                    this.carregarTabela();
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

    excluir() {
        if (!this.id_usuario) return;

        this.empregoService.deleteUltimoEmprego(this.id_usuario).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Registro deletado!'
                });

                this.limpar();
                this.empregoForm.enable();

                if (this.empregoForm.contains('id')) {
                    this.empregoForm.removeControl('id');
                }

                this.registroEmprego = [];
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao deletar registro.'
                });
            }
        });
    }

    confirmDelete(id: number) {
        this.confirmationService.confirm({
            message: 'Deseja excluir o registro?',
            accept: () => {
                this.excluir();
            }
        });
    }

    limpar() {
        this.empregoForm.reset({
            empresa: '',
            funcao: '',
            data_entrada: '',
            data_termino: '',
            atual: false,
            atividades: '',
            salario_atual: null
        });

        this.empregoForm.get('data_termino')?.enable();
    }
}
