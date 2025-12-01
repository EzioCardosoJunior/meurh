import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Usuario {
  // Dados pessoais
  nome?: string;
  nome_usuario: string;
  email: string;
  data_nascimento?: string;

  // Documentos
  cpf: string;
  rg?: string;
  cnh?: string;
  reservista?: string;

  // Dados adicionais
  cnpj?: string;
  pontos_preenchimento?: number;

  // Sistema
  funcao?: string;
  status?: string;

  // Acesso
  senha: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private baseUrl = '/api'; 

  constructor(private http: HttpClient) {}

  cadastrarUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/cadastrousr.php`, usuario);
  }
}
