import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Usuario {
  nome: string;
  nome_usuario: string;
  data_nascimento: string;  // formato: YYYY-MM-DD
  cpf: string;
  cnpj?: string | null;
  senha: string;
}

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  private baseUrl = '/api'; 

  constructor(private http: HttpClient) {}

  cadastrarUsuario(dados: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/cadastrousr.php`, dados);
  }
}


