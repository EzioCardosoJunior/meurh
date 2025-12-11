import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CadastroVagasService } from '../../service/cadastrovagas.service';

@Component({
  templateUrl: './listarvagascandidatos.component.html',
  providers: [MessageService, ConfirmationService]
})
export class ListarVagasCandidatosComponent implements OnInit {

  id_empresa = Number(localStorage.getItem('usuario_id'));
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

    this.vagasService.listarVagasEmpresa(this.id_empresa).subscribe({
      next: (res) => {
        this.vagas = res?.dados || [];
        this.carregando = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao carregar vagas.'
        });
        this.carregando = false;
      }
    });
  }

  confirmarDelete(vaga: any) {
    this.confirmationService.confirm({
      message: `Deseja excluir a vaga "${vaga.titulo}"?`,
      acceptLabel: "Sim",
      rejectLabel: "Não",
      icon: "pi pi-exclamation-triangle",
      accept: () => this.deletarVaga(vaga.id)
    });
  }

  deletarVaga(id: number) {
    this.vagasService.deletarVagaCandidato(id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga deletada.'
        });
        this.carregarVagas();
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao deletar vaga.'
        });
      }
    });
  }

}
