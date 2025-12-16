import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CadastroVagasService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  criarVaga(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salvar_vaga.php`, dados);
  }

  listarVagasEmpresa(id_empresa: number) {
    return this.http.get<any>(`${this.baseUrl}/listar_vagas_empresa.php?id_empresa=${id_empresa}`);
  }

  deletarVagaCandidato(id_vaga: number) {
    return this.http.post(`${this.baseUrl}/deletar_vaga.php`, { id_vaga });
  }

  deletarVaga(id_vaga: number, id_empresa: number) {
    return this.http.post('/api/deletar_vaga.php', { id_vaga, id_empresa });
  }

  listarTodasVagas() {
    return this.http.get<any>(
      `${this.baseUrl}/listar_todas_vagas.php`
    );
  }

  /**
 * Lista todas as vagas marcando se o usuário já se candidatou
 * (uso exclusivo do módulo "Vagas Disponíveis")
 */
  listarTodasVagasParaCandidato(id_usuario: number) {
    return this.http.get<any>(
      `${this.baseUrl}/listar_todas_vagas.php?id_usuario=${id_usuario}`
    );
  }

  /**
   * Candidatar usuário a uma vaga
   */
  candidatarVaga(id_usuario: number, id_vaga: number) {
    return this.http.post<any>(
      `${this.baseUrl}/candidatar_vaga.php`,
      { id_usuario, id_vaga }
    );
  }

  /**
   * Cancelar candidatura do usuário
   */
  cancelarCandidatura(id_usuario: number, id_vaga: number) {
    return this.http.post<any>(
      `${this.baseUrl}/cancelar_candidatura.php`,
      { id_usuario, id_vaga }
    );
  }

  listarVagasCandidatadas(id_usuario: number) {
    return this.http.get<any>(
      `${this.baseUrl}/listar_vagas_candidatadas.php?id_usuario=${id_usuario}`
    );
  }

  listarCandidatosDaVaga(id_empresa: number, id_vaga: number) {
    return this.http.get<any>(
      `${this.baseUrl}/listar_candidatos_vaga.php?id_empresa=${id_empresa}&id_vaga=${id_vaga}`
    );
  }

  salvarEntrevista(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/salvar_entrevista.php`,
      payload
    );
  }

  atualizarAgendado(id_candidatura: number, agendado: string) {
    return this.http.post(`${this.baseUrl}/update_agendado.php`, {
      id_candidatura,
      agendado
    });
  }

  getTotalEntrevistasPendentes() {
    return this.http.get<any>(
      `${this.baseUrl}/total_entrevistas_pendentes.php`
    );
  }




}
