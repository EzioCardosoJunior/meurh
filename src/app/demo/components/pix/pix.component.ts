import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PixService } from '../../service/pix.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './pix.component.html',
    providers: [MessageService]
})
export class PixComponent implements OnInit {

    pixForm!: FormGroup;
    id_usuario = Number(localStorage.getItem('usuario_id'));

    constructor(
        private fb: FormBuilder,
        private pixService: PixService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.pixForm = this.fb.group({
            chave_pix: ['', Validators.required],
            titular_nome: ['', Validators.required],
            titular_cpf: ['', Validators.required]
        });

        this.carregarPix();
    }

    carregarPix() {
        const id_usuario = Number(localStorage.getItem('usuario_id'));
        if (!id_usuario) return;

        this.pixService.getPix(id_usuario).subscribe({
            next: (res) => {
                if (res?.sucesso && res?.dados) {
                    this.pixForm.patchValue({
                        chave_pix: res.dados.chave_pix,
                        titular_nome: res.dados.titular_nome,
                        titular_cpf: res.dados.titular_cpf
                    });
                }
            },
            error: () => {

            }
        });
    }
    salvarPix() {
        
        if (this.pixForm.invalid) {
            this.pixForm.markAllAsTouched();
            return;
        }

        this.pixService.salvarOuAtualizar(this.id_usuario, this.pixForm.value)
            .subscribe({
                next: (res) => {
                    const isUpdate = !!this.pixForm.get('id')?.value;

                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: isUpdate ? 'PIX atualizado com sucesso!' : 'PIX cadastrado com sucesso!'
                    });

                    // Atualiza o ID no form (caso tenha sido cadastro)
                    if (res.id) {
                        this.pixForm.patchValue({ id: res.id });
                    }
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Erro',
                        detail: 'Falha ao salvar o PIX.'
                    });
                }
            });
    }

}
