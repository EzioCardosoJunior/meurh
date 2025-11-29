import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { IdentidadeUsrService } from '../../service/identidade-usr.service';
                                               
@Component({
    templateUrl: './identidadeusr.component.html',
    providers: [MessageService]
})
export class IdentidadeUsrComponent implements OnInit {

    identidadeForm!: FormGroup;
    id_usuario = Number(localStorage.getItem('usuario_id'));

    constructor(
        private fb: FormBuilder,
        private identidadeService: IdentidadeUsrService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.criarFormulario();
        this.carregarDados();
    }

    criarFormulario() {
        this.identidadeForm = this.fb.group({
            cnh: [''],
            reservista: [''],
            rg: [''],
            pontos_preenchimento: ['']
        });
    }

    carregarDados() {
        if (!this.id_usuario) return;

        this.identidadeService.getUsuario(this.id_usuario).subscribe({
            next: (res) => {
                if (res?.sucesso && res?.dados) {

                    // Preenche dados automaticamente
                    this.identidadeForm.patchValue({
                        cnh: res.dados.cnh ?? '',
                        reservista: res.dados.reservista ?? '',
                        rg: res.dados.rg ?? '',
                        pontos_preenchimento: res.dados.pontos_preenchimento ?? ''
                    });
                }
            }
        });
    }

    salvar() {
        const payload = {
            id_usuario: this.id_usuario,
            ...this.identidadeForm.getRawValue()
        };

        this.identidadeService.updateUsuario(payload).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Informações atualizadas!'
                });
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao atualizar os dados.'
                });
            }
        });
    }
}
