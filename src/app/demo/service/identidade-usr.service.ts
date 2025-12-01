import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdentidadeUsrService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  /** GET — Buscar dados do usuário */
  getUsuario(id_usuario: number): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get_usuario.php?id_usuario=${id_usuario}`
    );
  }

  /** POST — Atualizar dados do usuário */
  updateUsuario(payload: any): Observable<any> {
    console.log('Payload enviado para atualização:', payload);
    return this.http.post<any>(`${this.baseUrl}/update_usuario.php`, payload);
  }
}
