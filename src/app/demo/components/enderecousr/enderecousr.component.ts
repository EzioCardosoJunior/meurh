import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { EnderecoUsrService } from '../../service/endereco-usr.service';

@Component({
    templateUrl: './enderecousr.component.html',
    providers: [MessageService]
})
export class EnderecoUsrComponent implements OnInit {

    enderecoForm!: FormGroup;
    id_usuario = Number(localStorage.getItem('usuario_id'));

    registroEndereco: any[] = [];
    estados = [
        { label: 'AC', value: 'AC' },
        { label: 'AL', value: 'AL' },
        { label: 'AP', value: 'AP' },
        { label: 'AM', value: 'AM' },
        { label: 'BA', value: 'BA' },
        { label: 'CE', value: 'CE' },
        { label: 'DF', value: 'DF' },
        { label: 'ES', value: 'ES' },
        { label: 'GO', value: 'GO' },
        { label: 'MA', value: 'MA' },
        { label: 'MT', value: 'MT' },
        { label: 'MS', value: 'MS' },
        { label: 'MG', value: 'MG' },
        { label: 'PA', value: 'PA' },
        { label: 'PB', value: 'PB' },
        { label: 'PR', value: 'PR' },
        { label: 'PE', value: 'PE' },
        { label: 'PI', value: 'PI' },
        { label: 'RJ', value: 'RJ' },
        { label: 'RN', value: 'RN' },
        { label: 'RS', value: 'RS' },
        { label: 'RO', value: 'RO' },
        { label: 'RR', value: 'RR' },
        { label: 'SC', value: 'SC' },
        { label: 'SP', value: 'SP' },
        { label: 'SE', value: 'SE' },
        { label: 'TO', value: 'TO' }
    ];


    constructor(
        private fb: FormBuilder,
        private enderecoService: EnderecoUsrService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.criarFormulario();
        this.carregarEndereco();
    }

    criarFormulario() {
        this.enderecoForm = this.fb.group({
            tipo_residencia: ['', Validators.required],
            cidade: ['', Validators.required],
            estado: ['', [Validators.required, Validators.maxLength(2)]],
            bairro: ['', Validators.required],
            rua: ['', Validators.required],
            complemento: [''],
            cep: ['', Validators.required]
        });
    }

    carregarEndereco() {
        if (!this.id_usuario) return;

        this.enderecoService.getEnderecoUsuario(this.id_usuario).subscribe({
            next: (res) => {
                if (res?.sucesso && res?.dados) {

                    this.registroEndereco = [res.dados];

                    // Preenche o formulário
                    this.enderecoForm.patchValue(res.dados);

                    // adiciona o id_usuario no form (necessário no update)
                    if (!this.enderecoForm.get('id_usuario')) {
                        this.enderecoForm.addControl(
                            'id_usuario',
                            this.fb.control(res.dados.id_usuario)
                        );
                    }
                }
            }
        });
    }

    salvar() {
        if (this.enderecoForm.invalid) {
            this.enderecoForm.markAllAsTouched();
            this.messageService.add({
                severity: 'error',
                summary: 'Erro',
                detail: 'Preencha todos os campos obrigatórios.'
            });
            return;
        }

        const dados = this.enderecoForm.getRawValue();

        this.enderecoService.salvarOuAtualizar(this.id_usuario, dados).subscribe({
            next: () => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Sucesso',
                    detail: 'Endereço salvo com sucesso!'
                });

                this.carregarEndereco();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao salvar endereço.'
                });
            }
        });
    }

    limpar() {
        this.enderecoForm.reset({
            tipo_residencia: '',
            cidade: '',
            estado: '',
            bairro: '',
            rua: '',
            complemento: '',
            cep: ''
        });
    }
}
