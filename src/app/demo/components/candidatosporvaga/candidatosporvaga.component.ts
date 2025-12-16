import { Component, OnInit } from '@angular/core';
import { CadastroVagasService } from '../../service/cadastrovagas.service';
import { MessageService } from 'primeng/api';

@Component({
  templateUrl: './candidatosporvaga.component.html',
  providers: [MessageService]
})
export class CandidatosPorVagaComponent implements OnInit {

  id_empresa = Number(localStorage.getItem('usuario_id'));

  vagas: any[] = [];
  candidatos: any[] = [];

  selecionada: any = null;
  carregandoVagas = false;
  carregandoCandidatos = false;
  dialogAgendamento = false;
  candidatoSelecionado: any = null;

  formAgendamento: any = {
    agendado: 'A REVISAR',
    data_entrevista: '',
    entrevistador_nome: ''
  };

  constructor(
    private vagasService: CadastroVagasService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.carregarVagas();
  }

  carregarVagas() {
    this.carregandoVagas = true;

    this.vagasService.listarVagasEmpresa(this.id_empresa).subscribe({
      next: (res) => {
        this.vagas = res?.dados || [];
        this.carregandoVagas = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar suas vagas.'
        });
        this.carregandoVagas = false;
      }
    });
  }

  abrirDialogAgendamento(candidato: any) {
    this.candidatoSelecionado = candidato;

    // Pré-carrega dados se existirem
    this.formAgendamento = {
      agendado: candidato.agendado || 'A REVISAR',
      data_entrevista: candidato.data_entrevista || '',
      entrevistador_nome: candidato.entrevistador_nome || ''
    };

    this.dialogAgendamento = true;
  }

  salvarAgendamento() {

    const payload = {
      id_candidatura: this.candidatoSelecionado.id_candidatura,
      id_vaga: this.selecionada.id,
      id_usuario_editor: Number(localStorage.getItem('usuario_id')),

      ...this.formAgendamento
    };

    this.vagasService.salvarEntrevista(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Entrevista salva com sucesso'
        });

        this.dialogAgendamento = false;

        // Atualiza coluna "Agendado" na tabela
        this.candidatoSelecionado.agendado = this.formAgendamento.agendado;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar entrevista'
        });
      }
    });
  }

  selecionarVaga(vaga: any) {
    this.selecionada = vaga;
    this.buscarCandidatos(vaga.id);
  }

  atualizarAgendado(vaga: any) {
    this.vagasService
      .atualizarAgendado(vaga.id_candidatura, vaga.agendado)
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Atualizado',
          detail: 'Status agendado atualizado com sucesso.'
        });
      });
  }


  buscarCandidatos(id_vaga: number) {
    this.carregandoCandidatos = true;

    this.vagasService.listarCandidatosDaVaga(this.id_empresa, id_vaga).subscribe({
      next: (res) => {
        this.candidatos = res?.dados || [];
        this.carregandoCandidatos = false;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao buscar candidatos.'
        });
        this.carregandoCandidatos = false;
      }
    });
  }
}
