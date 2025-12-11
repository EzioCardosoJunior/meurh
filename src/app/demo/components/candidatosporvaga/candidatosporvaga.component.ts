import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CadastroVagasService } from '../../service/cadastrovagas.service';

@Component({
  templateUrl: './candidatosporvaga.component.html',
  providers: [MessageService, ConfirmationService]
})
export class CandidatosPorVagaComponent implements OnInit {

  id_usuario = Number(localStorage.getItem('usuario_id'));
  vagas: any[] = [];
  carregando = false;

  constructor(
    private vagasService: CadastroVagasService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit() {
    this.carregarVagas();
  }

  carregarVagas() {
    this.carregando = true;

    this.vagasService.listarVagasCandidatadas(this.id_usuario).subscribe({
      next: (res) => {
        this.vagas = res?.dados || [];
        this.carregando = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar suas vagas cadastradas.'
        });
        this.carregando = false;
      }
    });
  }

  confirmarCancelamento(vaga: any) {
    this.confirmationService.confirm({
      message: `Deseja cancelar sua candidatura para "${vaga.titulo}"?`,
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Sim",
      rejectLabel: "Não",
      accept: () => this.cancelarCandidatura(vaga)
    });
  }

  cancelarCandidatura(vaga: any) {
    this.vagasService
      .cancelarCandidatura(this.id_usuario, vaga.id)
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Cancelado',
            detail: 'Candidatura cancelada com sucesso.'
          });
          this.carregarVagas();
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao cancelar candidatura.'
          });
        }
      });
  }
}
