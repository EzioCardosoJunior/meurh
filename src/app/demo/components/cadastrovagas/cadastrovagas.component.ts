import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { CadastroVagasService } from '../../service/cadastrovagas.service';

@Component({
  templateUrl: './cadastrovagas.component.html',
  providers: [MessageService]
})
export class CadastroVagasComponent implements OnInit {

  vagaForm!: FormGroup;
  id_empresa = Number(localStorage.getItem('usuario_id'));

  modelosTrabalho = [
    { label: 'Presencial', value: 'presencial' },
    { label: 'Híbrido', value: 'hibrido' },
    { label: 'Remoto', value: 'remoto' }
  ];

  tiposContrato = [
    { label: 'CLT', value: 'clt' },
    { label: 'PJ', value: 'pj' },
    { label: 'Estágio', value: 'estagio' },
    { label: 'Temporário', value: 'temporario' },
    { label: 'Outros', value: 'outro' }
  ];

  // 🔹 NOVO: Segmentos
  segmentos = [
    { label: 'Comércio', value: 'Comércio' },
    { label: 'Indústria', value: 'Indústria' },
    { label: 'Educação', value: 'Educação' },
    { label: 'Serviços', value: 'Serviços' },
    { label: 'Setor público', value: 'Setor público' },
    { label: 'Agro e Pecuária', value: 'Agro e Pecuária' },
    { label: 'Tecnologia', value: 'Tecnologia' },
    { label: 'Outros', value: 'Outros' }
  ];

  constructor(
    private fb: FormBuilder,
    private cadastroVagas: CadastroVagasService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.criarFormulario();
  }

  criarFormulario(): void {
    this.vagaForm = this.fb.group({
      titulo: ['', Validators.required],
      descricao: ['', Validators.required],
      salario: [''],
      modelo_trabalho: ['', Validators.required],
      tipo_contrato: ['', Validators.required],

      // 🔹 NOVOS CAMPOS
      segmento: ['', Validators.required],
      jornada_trabalho: ['', Validators.required],

      cidade: ['', Validators.required],
      estado: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(2)]]
    });
  }

  salvarVaga(): void {
    if (this.vagaForm.invalid) {
      this.vagaForm.markAllAsTouched();

      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Preencha todos os campos obrigatórios.'
      });
      return;
    }

    const payload = {
      id_empresa: this.id_empresa,
      ...this.vagaForm.value
    };

    this.cadastroVagas.criarVaga(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Vaga cadastrada com sucesso!'
        });

        this.vagaForm.reset();
      },
      error: (err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: err?.error?.erro || 'Falha ao cadastrar vaga.'
        });
      }
    });
  }
}
