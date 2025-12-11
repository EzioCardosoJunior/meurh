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

        this.empregoForm = this.fb.group({
            empresa: ['', Validators.required],
            funcao: ['', Validators.required],
            data_entrada: ['', Validators.required],
            data_termino: [''],
            atual: [false],
            atividades: ['']
        });

        this.monitorarEmpregoAtual();
        this.carregarDados();
    }

    carregarTabela() {
        this.empregoService.getUltimoEmprego(this.id_usuario).subscribe({
            next: (res) => {
                if (res) {
                    this.registroEmprego = [res]; // tabela recebe array
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
                if (res.dados) {
                    // Se veio um emprego salvo
                    this.empregoForm.patchValue(res);

                    // Desabilita o form inteiro
                    this.empregoForm.disable();

                    // Mantém botão de excluir funcionando
                    this.empregoForm.enable({ onlySelf: true });
                    this.empregoForm.get('empresa')?.disable();
                    this.empregoForm.get('funcao')?.disable();
                    this.empregoForm.get('data_entrada')?.disable();
                    this.empregoForm.get('data_termino')?.disable();
                    this.empregoForm.get('atual')?.disable();
                    this.empregoForm.get('atividades')?.disable();

                    // Guarda o ID no form para update/delete
                    this.empregoForm.addControl('id', this.fb.control(res.id));
                }
            }
        });
    }


    salvar() {
        if (this.empregoForm.invalid) {
            this.empregoForm.markAllAsTouched();
            return;
        }

        this.empregoService.salvarOuAtualizar(this.id_usuario, this.empregoForm.getRawValue())
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Dados do emprego salvos com sucesso!'
                    });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Falha ao salvar2.'
                    });
                }
            });
    }

    excluir() {
        if (!this.id_usuario) return;

        this.empregoService.deleteUltimoEmprego(this.id_usuario).subscribe({
            next: (res) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Registro deletado!'
                });

                // Limpa e reabilita o formulário
                this.limpar();
                this.empregoForm.enable();
                this.empregoForm.removeControl('id');
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
                this.empregoService.deleteUltimoEmprego(this.id_usuario).subscribe(() => {
                    this.registroEmprego = null;
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Registro excluído!'
                    });
                });
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
            atividades: ''
        });

        this.empregoForm.get('data_termino')?.enable();
    }
}
