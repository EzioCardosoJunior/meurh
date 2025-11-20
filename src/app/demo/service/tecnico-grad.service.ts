import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TecnicoGradService {

  private baseUrl = '/api'; // segue o padrão dos outros serviços

  constructor(private http: HttpClient) { }

  /** POST — Salvar novo registro (técnico ou graduação) */
  salvarTecnicoGrad(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/salvar_tecnico_grad.php`, payload);
  }

  /** GET — Buscar TODOS os registros do usuário */
  getTecnicoGrad(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_tecnico_grad.php?id_usuario=${id_usuario}`);
  }
 
  /** DELETE — Excluir registro (POST, igual a outros serviços) */
  deleteTecnicoGrad(id_usuario: number, id_registro: number): Observable<any> {
    const payload = { id_usuario, id_registro };
    return this.http.post<any>(`${this.baseUrl}/deletar_tecnico_grad.php`, payload);
  }
}
