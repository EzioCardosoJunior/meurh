import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PixService {

  private baseUrl = '/api';   // usa seu proxy

  constructor(private http: HttpClient) {}

  /** GET - Obtém o PIX do usuário */
  getPix(id_usuario: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/get_pix.php?id_usuario=${id_usuario}`);
  }

  /** POST - Cadastra um novo PIX */
  salvarPix(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salvar_pix.php`, payload);
  }

  /** POST - Atualiza um PIX existente */
  atualizarPix(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/update_pix.php`, payload);
  }

  /**
   * Decide automaticamente se deve salvar ou atualizar
   */
  salvarOuAtualizar(id_usuario: number, dados: any): Observable<any> {
    const payload = { id_usuario, ...dados };

    return new Observable(observer => {
      this.getPix(id_usuario).subscribe({
        next: (res) => {
          if (res && res.dados.titular_cpf) {
            // PIX EXISTE → atualizar
            this.atualizarPix(payload).subscribe(observer);
          } else {
            // NÃO EXISTE → salvar
            this.salvarPix(payload).subscribe(observer);
          }
        },
        error: () => {
          // Se voltar erro (ex.: 404), tratar como inexistente
          this.salvarPix(payload).subscribe(observer);
        }
      });
    });
  }

}
