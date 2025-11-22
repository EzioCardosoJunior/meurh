import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UltimoEmpregoService } from '../../service/ultimo-emprego.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './ultimoemprego.component.html',
    providers: [MessageService]
})
export class UltimoEmpregoComponent implements OnInit {

    empregoForm!: FormGroup;
    id_usuario = Number(localStorage.getItem('usuario_id'));

    constructor(
        private fb: FormBuilder,
        private empregoService: UltimoEmpregoService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
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
                if (res?.sucesso && res?.dados) {
                    this.empregoForm.patchValue(res.dados);

                    if (res.dados.atual) {
                        this.empregoForm.get('data_termino')?.disable();
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
                        detail: 'Falha ao salvar.'
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
