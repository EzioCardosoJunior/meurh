import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface EmpregoAnterior {
    id?: number;
    id_usuario: number;
    nome_empresa: string;
    data_entrada: string;
    data_saida: string;
    chefe_nome: string;
    chefe_contato: string;
    cargo_funcao: string;
    descricao_atividades: string;
}

@Injectable({
    providedIn: 'root'
})
export class EmpregosAnterioresService {

    private baseUrl = '/api'; // ajuste aqui

    constructor(private http: HttpClient) { }

    // SALVAR
    salvarEmprego(data: EmpregoAnterior): Observable<any> {
        return this.http.post(`${this.baseUrl}/salvar_emprego_anterior.php`, data);
    }

    getEmpregos(id_usuario: number): Observable<any> {
        console.log('Fetching empregos anteriores for user ID:', id_usuario);
        return this.http.get<any>(`${this.baseUrl}/get_empregos_anteriores.php?id_usuario=${id_usuario}`);
    }


    // DELETE (corrigido)
    deletarEmprego(id_usuario: number, id_registro: number): Observable<any> {
        
console.log('Deleting emprego anterior with ID:', id_registro, 'for user ID:', id_usuario);
        return this.http.post(`${this.baseUrl}/delete_emprego_anterior.php`, {id_usuario, id_registro});
    }

    // UPDATE
    atualizarEmprego(data: EmpregoAnterior): Observable<any> {
        return this.http.post(`${this.baseUrl}/update_emprego_anterior.php`, data);
    }
}
