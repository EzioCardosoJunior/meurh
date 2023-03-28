import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelaLoginService {

  constructor(private router: Router) { }

  isAuthenticated(): any {
    const token = localStorage.getItem('token');    
    return token
  }
}
