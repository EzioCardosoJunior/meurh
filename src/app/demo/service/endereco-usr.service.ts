import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoUsrService {

  private baseUrl = '/api'; // usando proxy como no restante do sistema

  constructor(private http: HttpClient) {}

  /** GET — Buscar o endereço do usuário */
  getEnderecoUsuario(id_usuario: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get_endereco_usuario.php?id_usuario=${id_usuario}`
    );
  }

  /** POST — Criar um novo endereço */
  createEnderecoUsuario(payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/salvar_endereco_usuario.php`,
      payload
    );
  }

  /** POST — Atualizar endereço existente */
  updateEnderecoUsuario(id_usuario: number, payload: any): Observable<any> {
    return this.http.post<any>(
      `${this.baseUrl}/update_endereco_usuario.php`,
      { id_usuario, ...payload }
    );
  }

  /**
   * Decide automaticamente se deve criar ou atualizar:
   * - Se GET retornar sucesso: UPDATE
   * - Senão: CREATE
   */
  salvarOuAtualizar(id_usuario: number, dados: any): Observable<any> {
    const payload = { id_usuario, ...dados };

    return this.getEnderecoUsuario(id_usuario).pipe(
      switchMap(res => {
        if (res?.sucesso && res?.dados) {
          // já existe → atualizar
          return this.updateEnderecoUsuario(id_usuario, payload);
        }
        // não existe → criar
        return this.createEnderecoUsuario(payload);
      }),
      catchError(() => this.createEnderecoUsuario(payload))
    );
  }
}
