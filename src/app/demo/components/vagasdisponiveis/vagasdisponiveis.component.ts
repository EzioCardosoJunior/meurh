import { Component, OnInit } from '@angular/core';
import { CadastroVagasService } from '../../service/cadastrovagas.service';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './vagasdisponiveis.component.html',
    providers: [MessageService]
})
export class VagasDisponiveisComponent implements OnInit {

    vagas: any[] = [];
    carregando = false;

    constructor(
        private vagasService: CadastroVagasService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.listarVagas();
    }

    listarVagas() {
        this.carregando = true;

        this.vagasService.listarTodasVagas().subscribe({
            next: (res) => {
                if (res?.sucesso) {
                    this.vagas = res.dados || [];
                }
                this.carregando = false;
            },
            error: () => {
                this.carregando = false;
                this.messageService.add({
                    severity: 'error',
                    summary: 'Erro',
                    detail: 'Falha ao carregar vagas.'
                });
            }
        });
    }
}
