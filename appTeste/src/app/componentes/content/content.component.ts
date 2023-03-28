import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {

  constructor(private router: Router){}

  ngOnInit(): void {
  }
  
  iniciarConfiguracao(){
    this.router.navigate(['app-cadastro-matriz']);
  }
}
