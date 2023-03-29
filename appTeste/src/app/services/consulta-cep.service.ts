import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConsultaCepService {
  rotaUrl = "https://viacep.com.br/ws/";
  
  constructor(  private http: HttpClient ) { }
  

  getConfig(a: any) {  
    return this.http.get(this.rotaUrl + a + "/json/");  
  }
}
