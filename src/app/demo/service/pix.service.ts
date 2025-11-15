import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PixService {

  private baseUrl = '/api'; // usando o proxy

  constructor(private http: HttpClient) {}

  salvarPix(data: any): Observable<any> {
    alert(12)
    return this.http.post(`${this.baseUrl}/pix_cadastrar.php`, data);
  }
}
