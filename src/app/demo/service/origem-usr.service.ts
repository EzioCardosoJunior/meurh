import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrigemUsrService {

  private baseUrl = '/api'; // usa seu proxy

  constructor(private http: HttpClient) { }

  /** GET — Busca a origem do candidato (retorna {sucesso, dados} no padrão dos seus PHPs) */
  getOrigemCandidato(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_origem_candidato.php?id_usuario=${id_usuario}`);
  }

  /** POST — Cria um registro de origem */
  createOrigemCandidato(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/salvar_origem_candidato.php`, payload);
  }

  /** POST — Atualiza um registro de origem (seguindo seu padrão de usar POST para update) */
  updateOrigemCandidato(id_usuario: number, payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/update_origem_candidato.php`,
      { id_usuario, ...payload }
    );
  }



  /** POST — Deletar registro (por id_usuario, conforme padrão dos seus deletes anteriores) */
  deleteOrigemCandidato(id_usuario: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/deletar_origem_candidato.php`, { id_usuario });
  }

  /**
   * Decide automaticamente se deve criar ou atualizar:
   * - consulta o backend (getOrigemCandidato)
   * - se existir (res.sucesso && res.dados && res.dados.id) → chama update
   * - senão → chama create
   */
  salvarOuAtualizar(id_usuario: number, dados: any): Observable<any> {
    const payload = { id_usuario, ...dados };

    return this.getOrigemCandidato(id_usuario).pipe(
      switchMap(res => {
        if (res?.sucesso && res?.dados) {
          // Já existe → UPDATE
          return this.updateOrigemCandidato(id_usuario, payload);
        }

        // Não existe → CREATE
        return this.createOrigemCandidato(payload);
      }),
      catchError(() => this.createOrigemCandidato(payload))
    );
  }


}
