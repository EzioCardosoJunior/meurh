import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FundamentalMedioService {

  private baseUrl = '/api'; // segue o padrão dos outros serviços

  constructor(private http: HttpClient) {}

  /** POST — Salvar registro de Ensino Fundamental e Médio */
  salvarFundMedio(payload: any): Observable<any> {
    console.log('Payload enviado para salvarFundMedio:', payload);
    return this.http.post<any>(`${this.baseUrl}/salvar_ensino_fund_medio.php`, payload);
  }

  /** GET — Buscar registros do usuário */
  getFundMedio(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_ensino_fund_medio.php?id_usuario=${id_usuario}`);
  }

  /** DELETE — Remover um registro */
  deletarFundMedio(id_usuario: number, id_registro: number): Observable<any> {
    const payload = { id_usuario, id_registro };
    return this.http.post<any>(`${this.baseUrl}/deletar_ensino_fund_medio.php`, payload);
  }

}
