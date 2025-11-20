    import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class OutrasAtividadesService {

    private baseUrl = '/api'; // ajuste se necessário

    constructor(private http: HttpClient) {}

    // ----------------------------------------
    // GET - Buscar todas as atividades do usuário
    // ----------------------------------------
    getAtividades(id_usuario: number): Observable<any> {
        return this.http.get(`${this.baseUrl}/get_trabalhos_temp.php?id_usuario=${id_usuario}`);
    }

    // ----------------------------------------
    // POST - Salvar nova atividade
    // ----------------------------------------
    salvarAtividade(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/salvar_trabalho_temp.php`, payload);
    }

    // ----------------------------------------
    // DELETE - Remover atividade
    // ----------------------------------------
    deleteAtividade(id_registro: number) {
    return this.http.get<any>(`${this.baseUrl}/delete_trabalho_temp.php?id=${id_registro}`);
}


    // ----------------------------------------
    // UPDATE - Editar atividade existente
    // ----------------------------------------
    updateAtividade(payload: any): Observable<any> {
        return this.http.post(`${this.baseUrl}/update_outra_atividade.php`, payload);
    }
}
