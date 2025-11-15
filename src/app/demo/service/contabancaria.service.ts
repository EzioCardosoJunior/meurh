import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContaBancariaService {

  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  salvarConta(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cadastrar_conta.php`, payload);
  }

}
