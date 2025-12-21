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
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Não foi possível carregar suas vagas.'
        });
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
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Falha ao buscar candidatos.'
          });
        }
      });
  }

  /* =====================================================
     DIÁLOGO DE AGENDAMENTO
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
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha os campos obrigatórios.'
      });
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
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Entrevista salva com sucesso.'
        });

        this.dialogAgendamento = false;

        // Atualiza visualmente a tabela
        this.candidatoSelecionado.agendado =
          this.agendamentoForm.value.agendado;
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao salvar entrevista.'
        });
      }
    });
  }
}
