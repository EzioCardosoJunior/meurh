import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UltimosUsuariosService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) { }

  /**
   * Busca os 10 últimos usuários cadastrados
   */
  listarUltimosUsuarios(): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/get_ultimos_usuarios_cad.php`
    );
  }

  getUsuariosOnline(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get_usuarios_online.php`);
  }

}
