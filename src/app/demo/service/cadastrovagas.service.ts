import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CadastroVagasService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  criarVaga(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salvar_vaga.php`, dados);
  }

  listarVagasEmpresa(id_empresa: number) {
    return this.http.get(`${this.baseUrl}/listar_vagas_empresa.php?id_empresa=${id_empresa}`);
  }
}
