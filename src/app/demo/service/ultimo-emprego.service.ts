import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

export interface UltimoEmprego {
  id?: number;
  id_usuario: number;
  empresa: string;
  funcao: string;
  data_entrada: string;
  data_termino?: string | null;
  atual: boolean;
  atividades: string;
}

@Injectable({
  providedIn: 'root'
})
export class UltimoEmpregoService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // === BUSCAR ===
  getUltimoEmprego(id_usuario: number): Observable<any> {
    console.log('getUltimoEmprego chamado com id_usuario:', id_usuario);
    return this.http.get<any>(`${this.baseUrl}/get_ultimo_emprego.php?id_usuario=${id_usuario}`);
  }

  // === SALVAR (INSERT) ===
  salvarUltimoEmprego(data: UltimoEmprego): Observable<any> {
    console.log('salvarUltimoEmprego payload:', data);
    return this.http.post<any>(`${this.baseUrl}/salvar_emprego_atual.php`, data);
  }

  // === ATUALIZAR ===
  atualizarUltimoEmprego(data: UltimoEmprego): Observable<any> {
    console.log('atualizarUltimoEmprego payload:', data);
    return this.http.post<any>(`${this.baseUrl}/update_ultimo_emprego.php`, data);
  }

  // === SALVAR OU ATUALIZAR — SIMPLES (usa presence de id) ===
  salvarOuAtualizar(id_usuario: number, formData: any): Observable<any> {
    const payload: UltimoEmprego = { ...formData, id_usuario };
   
    if (payload.id && Number(payload.id) > 0) {
      console.log('Decisão: atualizar (id presente). Payload:', payload);
      return this.atualizarUltimoEmprego(payload);
    }

    
    console.log('Decisão: salvar novo (sem id). Payload:', payload);
    return this.salvarUltimoEmprego(payload);
  }

  // === SALVAR OU ATUALIZAR — ROBUSTO (consulta backend antes) ===
 
  salvarOuAtualizarViaBackend(id_usuario: number, formData: any): Observable<any> {
    const payload: UltimoEmprego = { ...formData, id_usuario };

    return this.getUltimoEmprego(id_usuario).pipe(
      switchMap(res => {
        // Supondo resposta do backend no formato { sucesso: true, dados: {...} } quando existe
        if (res && res.sucesso && res.dados && res.dados.id) {
          // já existe → usa update (inclui id do registro retornado)
          payload.id = res.dados.id;
          console.log('Backend diz que existe registro. Atualizando. payload:', payload);
          return this.atualizarUltimoEmprego(payload);
        } else {
          // não existe → salvar
          console.log('Backend diz que não existe registro. Salvando. payload:', payload);
          return this.salvarUltimoEmprego(payload);
        }
      }),
      catchError(err => {
        // Se ocorrer erro ao consultar (por ex. 404), tratamos como inexistente e salvamos
        console.warn('Erro ao consultar backend (tratado como "não existe"), salvando novo. Erro:', err);
        return this.salvarUltimoEmprego(payload);
      })
    );
  }

  // === DELETAR ===
  deleteUltimoEmprego(id_usuario: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/delete_ultimo_emprego.php`, { id_usuario });
  }
}
