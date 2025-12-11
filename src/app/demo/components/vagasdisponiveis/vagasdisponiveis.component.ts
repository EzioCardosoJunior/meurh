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

    id_usuario = Number(localStorage.getItem('usuario_id'));

    constructor(
        private vagasService: CadastroVagasService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.carregarVagas();
    }

    /* =========================
       CARREGAR VAGAS
    ========================= */
    carregarVagas() {
        this.carregando = true;

        if (this.id_usuario) {
            // USUÁRIO LOGADO → consulta com candidatura
            this.vagasService
                .listarTodasVagasParaCandidato(this.id_usuario)
                .subscribe({
                    next: (res) => {
                        this.vagas = res?.dados || [];
                        this.carregando = false;
                    },
                    error: () => this.erroCarregar()
                });

        } else {
            // VISITANTE → lista vagas normais
            this.vagasService
                .listarTodasVagas()
                .subscribe({
                    next: (res) => {
                        this.vagas = res?.dados || [];
                        this.carregando = false;
                    },
                    error: () => this.erroCarregar()
                });
        }
    }


    private erroCarregar() {
        this.carregando = false;
        this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao carregar vagas.'
        });
    }

    /* =========================
       CANDIDATAR
    ========================= */
    candidatar(id_vaga: number) {
        if (!this.id_usuario) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Atenção',
                detail: 'Você precisa estar logado para se candidatar.'
            });
            return;
        }

        this.vagasService
            .candidatarVaga(this.id_usuario, id_vaga)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Sucesso',
                        detail: 'Candidatura realizada!'
                    });
                    this.carregarVagas();
                }
            });
    }

    /* =========================
       CANCELAR CANDIDATURA
    ========================= */
    cancelar(id_vaga: number) {
        this.vagasService
            .cancelarCandidatura(this.id_usuario, id_vaga)
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'info',
                        summary: 'Cancelado',
                        detail: 'Candidatura cancelada.'
                    });
                    this.carregarVagas();
                }
            });
    }
}
