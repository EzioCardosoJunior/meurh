import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContaBancariaService {

  private baseUrl = '/api'; // usa seu proxy

  constructor(private http: HttpClient) {}

  /** GET — Obtém a conta bancária do usuário */
  getConta(id_usuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_conta_bancaria.php?id_usuario=${id_usuario}`);
  }

  /** POST — Cadastra nova conta */
  salvarConta(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salvar_conta_bancaria.php`, payload);
  }

  /** POST — Atualiza uma conta já existente */
  atualizarConta(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_conta_bancaria.php`, payload);
  }

  /**
   * Decide automaticamente se deve salvar ou atualizar
   */
  salvarOuAtualizar(id_usuario: number, dados: any): Observable<any> {
    const payload = { id_usuario, ...dados };

    return new Observable(observer => {
      this.getConta(id_usuario).subscribe({
        next: (res) => {
          if (res) {
            // Já existe conta → Atualizar
            this.atualizarConta(payload).subscribe(observer);
          } else {
            // Não existe → Criar nova
            this.salvarConta(payload).subscribe(observer);
          }
        },
        error: () => {
          // Se erro 404 → Nenhuma conta cadastrada → Salvar nova
          this.salvarConta(payload).subscribe(observer);
        }
      });
    });
  }

}
