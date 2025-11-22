import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class UltimoEmpregoService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // === BUSCAR ===
  getUltimoEmprego(id_usuario: number): Observable<any> {
    return this.http.get(
      `${this.baseUrl}/get_ultimo_emprego.php?id_usuario=${id_usuario}`
    );
  }

  // === SALVAR (INSERT) ===
  salvarUltimoEmprego(data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/salvar_emprego_atual.php`, data);
  }

  // === ATUALIZAR ===
  atualizarUltimoEmprego(data: any): Observable<any> {
    console.log('Atualizando último emprego:', data);
    return this.http.post(`${this.baseUrl}/update_ultimo_emprego.php`, data);
  }

  // === SALVAR OU ATUALIZAR ===
  salvarOuAtualizar(id_usuario: number, formData: any): Observable<any> {
    console.log('Salvando ou atualizando último emprego:', formData);   
    const payload: any = {
      ...formData,
      id_usuario
    };

    // Se tem ID → atualizar
    if (formData) {
      return this.atualizarUltimoEmprego(payload);
    }

    // Senão → salvar novo
    return this.salvarUltimoEmprego(payload);
  }

  // === DELETAR ===
  deleteUltimoEmprego(id_usuario: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/delete_ultimo_emprego.php`, {
      id_usuario
    });
  }
}
