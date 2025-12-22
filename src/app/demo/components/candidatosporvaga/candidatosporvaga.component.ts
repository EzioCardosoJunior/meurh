import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  candidatoSelecionado: any = null;

  carregandoVagas = false;
  carregandoCandidatos = false;

  dialogAgendamento = false;
  tentouSalvar = false;

  agendamentoForm!: FormGroup;

  constructor(
    private vagasService: CadastroVagasService,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {}

  /* =====================================================
     INIT
  ===================================================== */
  ngOnInit(): void {
    this.carregarVagas();
    this.criarFormularioAgendamento();
  }

  /* =====================================================
     FORMULÁRIO
  ===================================================== */
  criarFormularioAgendamento(): void {
    this.agendamentoForm = this.fb.group({
      agendado: [null, Validators.required],
      data_entrevista: [null, Validators.required],
      entrevistador_nome: ['']
    });
  }

  /* =====================================================
     VAGAS
  ===================================================== */
  carregarVagas(): void {
    this.carregandoVagas = true;

    this.vagasService.listarVagasEmpresa(this.id_empresa).subscribe({
      next: (res) => {
        this.vagas = res?.dados || [];
        this.carregandoVagas = false;
      },
      error: () => {
        this.carregandoVagas = false;
        this.toastErro('Não foi possível carregar suas vagas.');
      }
    });
  }

  selecionarVaga(vaga: any): void {
    this.selecionada = vaga;
    this.buscarCandidatos(vaga.id);
  }

  /* =====================================================
     CANDIDATOS
  ===================================================== */
  buscarCandidatos(id_vaga: number): void {
    this.carregandoCandidatos = true;

    this.vagasService
      .listarCandidatosDaVaga(this.id_empresa, id_vaga)
      .subscribe({
        next: (res) => {
          this.candidatos = res?.dados || [];
          this.carregandoCandidatos = false;
        },
        error: () => {
          this.carregandoCandidatos = false;
          this.toastErro('Falha ao buscar candidatos.');
        }
      });
  }

  /* =====================================================
     AGENDAMENTO
  ===================================================== */
  abrirDialogAgendamento(candidato: any): void {
    this.candidatoSelecionado = candidato;
    this.tentouSalvar = false;

    this.agendamentoForm.reset({
      agendado: candidato.agendado || null,
      data_entrevista: candidato.data_entrevista || null,
      entrevistador_nome: candidato.entrevistador_nome || ''
    });

    this.dialogAgendamento = true;
  }

  salvarAgendamento(): void {
    this.tentouSalvar = true;

    if (this.agendamentoForm.invalid) {
      this.toastAviso('Preencha os campos obrigatórios.');
      return;
    }

    const payload = {
      id_candidatura: this.candidatoSelecionado.id_candidatura,
      id_vaga: this.selecionada.id,
      id_usuario_editor: Number(localStorage.getItem('usuario_id')),
      ...this.agendamentoForm.value
    };

    this.vagasService.salvarEntrevista(payload).subscribe({
      next: () => {
        this.toastSucesso('Entrevista salva com sucesso.');
        this.dialogAgendamento = false;

        // Atualiza tabela local
        Object.assign(this.candidatoSelecionado, this.agendamentoForm.value);
      },
      error: () => {
        this.toastErro('Falha ao salvar entrevista.');
      }
    });
  }

  /* =====================================================
     DELETAR ENTREVISTA (CONFIRMAÇÃO VIA TOAST)
  ===================================================== */
  confirmarDelecao(): void {
    if (!this.candidatoSelecionado) {
      return;
    }

    this.messageService.add({
      key: 'confirmDelete',
      severity: 'warn',
      summary: 'Confirmar exclusão',
      detail: 'Tem certeza que deseja deletar esta entrevista?',
      sticky: true,
      data: this.candidatoSelecionado
    });
  }

  deletarEntrevista(confirmado: boolean): void {
    this.messageService.clear('confirmDelete');

    if (!confirmado) {
      return;
    }

    const payload = {
      id_candidatura: this.candidatoSelecionado.id_candidatura,
      id_vaga: this.selecionada.id,
      id_usuario_editor: Number(localStorage.getItem('usuario_id'))
    };

    this.vagasService.deletarEntrevista(payload).subscribe({
      next: () => {
        this.toastSucesso('Entrevista removida com sucesso.');

        // Atualiza tabela local
        this.candidatoSelecionado.agendado = 'NÃO';
        this.candidatoSelecionado.data_entrevista = null;
        this.candidatoSelecionado.entrevistador_nome = null;

        this.dialogAgendamento = false;
      },
      error: () => {
        this.toastErro('Falha ao remover entrevista.');
      }
    });
  }

  /* =====================================================
     TOAST HELPERS
  ===================================================== */
  private toastSucesso(msg: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Sucesso',
      detail: msg
    });
  }

  private toastErro(msg: string): void {
    this.messageService.add({
      severity: 'error',
      summary: 'Erro',
      detail: msg
    });
  }

  private toastAviso(msg: string): void {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atenção',
      detail: msg
    });
  }
}
