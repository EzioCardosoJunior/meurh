import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private tokenKey = 'authToken';
  private baseUrl = '/api';

  constructor(private http: HttpClient, private router: Router) {}

  /**
   * Envia o login para o backend e salva o token/localStorage em caso de sucesso
   */
  loginRequest(credentials: { nome_usuario: string; senha: string }): Observable<any> {
    console.log(credentials)
    console.log(this.baseUrl)
    
    return this.http.post<any>(`${this.baseUrl}/loginUsr.php`, credentials).pipe(
      tap(response => {
        if (response.sucesso && response.token) {
          this.login(response.token);
          localStorage.setItem('usuario', JSON.stringify(response.usuario));
        }
      })
    );
  }

  login(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem('usuario');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsuario(): any {
    const user = localStorage.getItem('usuario');
    return user ? JSON.parse(user) : null;
  }
}
