import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PosGraduacaoService {

  private baseUrl = '/api'; // segue o padrão dos outros serviços

  constructor(private http: HttpClient) {}

  /** POST — Salvar nova pós-graduação */
  salvarPos(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/salvar_pos.php`, payload);
  }

  /** GET — Buscar TODAS as pós-graduações do usuário */
  getPos(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_pos.php?id_usuario=${id_usuario}`);
  }

  /** DELETE — Excluir uma pós */
  deletarPos(id_usuario: number, id_pos: number): Observable<any> {
    const payload = { id_usuario, id_pos };
    return this.http.post<any>(`${this.baseUrl}/deletar_pos.php`, payload);
  }
}
