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
    console.log('ID da empresa:', id_empresa);
    return this.http.get<any>(`${this.baseUrl}/listar_vagas_empresa.php?id_empresa=${id_empresa}`);
  }

  deletarVaga(id_vaga: number) {
    return this.http.post(`${this.baseUrl}/deletar_vaga.php`, { id_vaga });
  }

}
