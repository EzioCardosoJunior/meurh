import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OutrosCursosService {

  private baseUrl = '/api'; // igual aos outros services

  constructor(private http: HttpClient) {}

  /** POST — Salvar novo curso */
  salvarCurso(payload: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/salvar_outros_cursos.php`, payload);
  }

  /** GET — Buscar TODOS os cursos do usuário */
  getCursos(id_usuario: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_outros_cursos.php?id_usuario=${id_usuario}`);
  }
}
