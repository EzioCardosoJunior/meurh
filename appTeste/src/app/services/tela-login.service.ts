import { Router } from '@angular/router';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TelaLoginService {

  mostraSidebar = new EventEmitter<boolean>();
  token: any;
  constructor(private router: Router) { }
  
  
  isAuthenticated(): any {    
    this.token = localStorage.getItem('token'); 
    this.token ? this.mostraSidebar.emit(true) : this.mostraSidebar.emit(false)     
    this.router.navigate(['app-home']);
  }
  verificaAuth(): any {    
    this.token = localStorage.getItem('token'); 
    this.token ? this.mostraSidebar.emit(true) : this.mostraSidebar.emit(false)    
   
  }

 
}
